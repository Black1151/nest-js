import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { EntityNotFoundError } from 'typeorm';

import { ApiPermissionMappingService } from './sub/api-permissions-mapping/api-permission-mapping.service';
import { PermissionService } from './sub/permission/permission.service';
import { PERMISSION_KEY_METADATA } from './decorators/resolver-permission-key.decorator';
import { IS_PUBLIC_ROUTE_KEY } from 'src/decorators/public.decorator';
import { IS_DISABLED_OPERATION_KEY } from 'src/common/decorators/disabled-operation.decorator';

@Injectable()
export class RbacBootstrapService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly mappingService: ApiPermissionMappingService,
    private readonly permissionService: PermissionService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * On application start, walk every GraphQL resolver, collect the
   * `@RbacPermissionKey()` values, and guarantee a matching Permission entity
   * exists and is mapped.
   */
  async onModuleInit(): Promise<void> {
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      const { instance } = provider;
      if (!instance || typeof instance !== 'object') continue;

      const resolverName = instance.constructor.name;
      if (!resolverName.endsWith('Resolver')) continue;

      /**
       * Walk the prototype chain so inherited resolver methods are included.
       */
      let currentProto: any = Object.getPrototypeOf(instance);
      while (currentProto && currentProto !== Object.prototype) {
        const methodNames = Object.getOwnPropertyNames(currentProto).filter(
          (prop) =>
            typeof currentProto[prop] === 'function' && prop !== 'constructor',
        );

        for (const methodName of methodNames) {
          const methodRef = currentProto[methodName];

          const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_ROUTE_KEY,
            [methodRef, currentProto.constructor],
          );

          const isDisabled = this.reflector.getAllAndOverride<boolean>(
            IS_DISABLED_OPERATION_KEY,
            [methodRef, currentProto.constructor],
          );

          if (isPublic || isDisabled) continue;

          const stableKey: string | undefined = Reflect.getMetadata(
            PERMISSION_KEY_METADATA,
            methodRef,
          );

          if (!stableKey) {
            throw new Error(
              `[RBAC Bootstrap] Method "${methodName}" in "${resolverName}" is neither @Public() nor @RbacPermissionKey().` +
                ' Every resolver must be explicitly protected or declared public.',
            );
          }

          await this.registerRouteKey(
            stableKey,
            `Auto-created permission for ${stableKey}`,
          );
        }

        currentProto = Object.getPrototypeOf(currentProto);
      }
    }

    // eslint-disable-next-line no-console
    console.log('RBAC stable keys have been fully registered.');
  }

  /**
   * Ensures both:
   *   1. A Permission row with `name === routeKey` exists (creates if missing)
   *   2. The ApiPermissionMapping includes that Permission
   */
  private async registerRouteKey(
    routeKey: string,
    description: string,
  ): Promise<void> {
    const mapping = await this.mappingService.findOrCreate(routeKey);

    let permission;
    try {
      permission = await this.permissionService.findOneBy({ name: routeKey });
    } catch (err) {
      /**
       * TypeORM’s repo.findOne*OrFail() throws EntityNotFoundError.
       * Other code may throw Nest’s NotFoundException.
       * Treat both the same: the permission doesn’t exist yet.
       */
      if (
        err instanceof NotFoundException ||
        err instanceof EntityNotFoundError
      ) {
        permission = await this.permissionService.create({
          name: routeKey,
          description,
        });
      } else {
        // Bubble up truly unexpected errors.
        throw err;
      }
    }

    const alreadyAssigned = mapping.requiredPermissions.some(
      (p) => p.id === permission.id,
    );

    if (!alreadyAssigned) {
      mapping.requiredPermissions.push(permission);
      await this.mappingService.saveMapping(mapping);
    }
  }
}

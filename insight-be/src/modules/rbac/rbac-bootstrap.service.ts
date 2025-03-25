import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { ApiPermissionMappingService } from './sub/api-permissions-mapping/api-permission-mapping.service';
import { PermissionService } from './sub/permission/permission.service';
import { PERMISSION_KEY_METADATA } from './decorators/resolver-permission-key.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class RbacBootstrapService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly mappingService: ApiPermissionMappingService,
    private readonly permissionService: PermissionService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      const { instance } = provider;

      if (!instance || typeof instance !== 'object') {
        continue;
      }

      const resolverName = instance.constructor.name;
      if (!resolverName.endsWith('Resolver')) {
        continue;
      }

      let currentProto = Object.getPrototypeOf(instance);
      while (currentProto && currentProto !== Object.prototype) {
        const methodNames = Object.getOwnPropertyNames(currentProto).filter(
          (prop) =>
            typeof currentProto[prop] === 'function' && prop !== 'constructor',
        );

        for (const methodName of methodNames) {
          const methodRef = currentProto[methodName];

          const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [methodRef, currentProto.constructor],
          );

          const stableKey = Reflect.getMetadata(
            PERMISSION_KEY_METADATA,
            methodRef,
          );

          // console.log(
          //   `RbacBootstrapService: Found method "${methodName}" in ${resolverName}`,
          //   `=> isPublic=${isPublic}, stableKey=${stableKey}`,
          // );

          if (isPublic) {
            continue;
          }

          if (!stableKey) {
            throw new Error(
              `[RBAC Bootstrap Error] Method "${methodName}" in "${resolverName}" is neither @Public() nor @RbacPermissionKey(). 
               All resolvers must be explicitly protected or marked public.`,
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

    console.log('RBAC stable keys have been fully registered.');
  }

  private async registerRouteKey(routeKey: string, description: string) {
    const mapping = await this.mappingService.findOrCreate(routeKey);

    let permission;
    try {
      permission = await this.permissionService.findOneBy({ name: routeKey });
    } catch (err) {
      if (err instanceof NotFoundException) {
        permission = await this.permissionService.create({
          name: routeKey,
          description,
        });
      } else {
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

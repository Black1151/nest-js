import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ApiPermissionMappingService } from 'src/modules/rbac/sub/api-permissions-mapping/api-permission-mapping.service';
import { UsersService } from 'src/modules/user/user.service';
import { PERMISSION_KEY_METADATA } from '../decorators/resolver-permission-key.decorator';
import { IS_PUBLIC_ROUTE_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class ApiPermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly mappingService: ApiPermissionMappingService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();

    const handler = gqlCtx.getHandler();
    const clazz = gqlCtx.getClass();

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      [gqlCtx.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const permissionKey = this.reflector.get<string>(
      PERMISSION_KEY_METADATA,
      handler,
    );

    if (!permissionKey) {
      throw new UnauthorizedException(
        'No permission key found on a non-public route',
      );
    }

    const mapping = await this.mappingService.findByRouteKey(permissionKey);
    if (!mapping) {
      throw new ForbiddenException(
        `No permission mapping found for key: ${permissionKey}. Access denied.`,
      );
    }

    if (!req?.user?.publicId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.userService.getUserWithRolesAndPermissions(
      req.user.publicId,
    );

    if (
      process.env.NODE_ENV === 'development' &&
      user?.roles?.some((role) => role.name === 'super_admin')
    ) {
      return true;
    }

    const requiredPermissions = mapping.requiredPermissions.map((p) => p.name);

    req.user.permissions = user['combinedPermissions'] || [];

    const hasAll = requiredPermissions.every((perm) =>
      req.user.permissions.includes(perm),
    );

    if (!hasAll) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

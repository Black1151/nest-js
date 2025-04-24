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

    console.log('PERMISSIONS GUARD HIT');

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      [gqlCtx.getHandler(), context.getClass()],
    );

    if (isPublic) {
      console.log('route is public');
      return true;
    }

    const permissionKey = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY_METADATA,
      [handler, clazz],
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

    // console.log('XXX', user);

    if (
      process.env.NODE_ENV === 'development' &&
      user?.roles?.some((role) => role.name === 'super_admin')
    ) {
      console.log('super admin, returning true');
      return true;
    }

    const requiredPermissions = mapping.requiredPermissions.map((p) => p.name);
    console.log('required Permissions', requiredPermissions);

    req.user.permissions = user['combinedPermissions'] || [];
    console.log('user permissiions', req.user.permissions);

    const hasAll = requiredPermissions.every((perm) =>
      req.user.permissions.includes(perm),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permissions ${requiredPermissions[0]}`,
      );
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiPermissionMappingService } from 'src/modules/rbac/sub/api-permissions-mapping/api-permission-mapping.service';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY_METADATA } from '../decorators/resolver-permission-key.decorator';
import { UsersService } from 'src/modules/user/user.service';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class ApiPermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly mappingService: ApiPermissionMappingService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const handler = context.getHandler();
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
      req?.user?.publicId,
    );

    if (
      process.env.NODE_ENV === 'development' &&
      user?.roles?.some((role) => role.name === 'super_admin')
    ) {
      return true;
    }

    const requiredPermissions = mapping.requiredPermissions.map((p) => p.name);
    const userPerms = req.user.permissions || [];
    const hasAll = requiredPermissions.every((p) => userPerms.includes(p));
    if (!hasAll) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

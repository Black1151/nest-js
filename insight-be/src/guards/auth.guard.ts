import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE_KEY } from 'src/decorators/public.decorator';
import { UsersService } from 'src/modules/user/user.service';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      [gqlCtx.getHandler(), gqlCtx.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const canActivateResult = (await super.canActivate(context)) as boolean;
    if (!canActivateResult) {
      return false;
    }

    const req = this.getRequest(context);

    const user = req.user;

    if (!user || !user.publicId) {
      throw new UnauthorizedException(
        'Invalid token payload: missing publicId',
      );
    }

    const dbUser = await this.usersService.getUserWithRolesAndPermissions(
      user.publicId,
    );

    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }
    const permissionNames = new Set<string>();
    dbUser.roles?.forEach((role) => {
      role.permissions?.forEach((perm) => permissionNames.add(perm.name));
    });

    req.user = {
      ...user,
      permissions: Array.from(permissionNames),
    };

    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

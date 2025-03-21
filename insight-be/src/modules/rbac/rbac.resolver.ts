import { Args, Query, Resolver } from '@nestjs/graphql';
import { RolesPermissionsResponse } from './dto/roles-permissions-response.dto';
import { UsersService } from 'src/user/user.service';
import { UserPermissionsInput } from './dto/roles-permissions-input.dto';
import { NotFoundException } from '@nestjs/common';

@Resolver()
export class UserPermissionsResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => RolesPermissionsResponse)
  async userPermissions(
    @Args('data') data: UserPermissionsInput,
  ): Promise<RolesPermissionsResponse> {
    const user = await this.userService.getUserWithRolesAndPermissions(
      data.publicId,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles =
      user.roles?.map((r) => ({
        id: r.id,
        name: r.name,
      })) || [];
    const uniquePermissions = new Map<number, { id: number; name: string }>();

    user.roles?.forEach((role) => {
      role.permissions?.forEach((perm) => {
        if (!uniquePermissions.has(perm.id)) {
          uniquePermissions.set(perm.id, {
            id: perm.id,
            name: perm.name,
          });
        }
      });
    });

    return {
      roles,
      permissions: Array.from(uniquePermissions.values()),
    };
  }
}

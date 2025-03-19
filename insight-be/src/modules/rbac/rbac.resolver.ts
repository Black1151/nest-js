import { Args, Query, Resolver } from "@nestjs/graphql";
import { RolesPermissionsResponse } from "./dto/roles-permissions-response.dto";
import { UsersService } from "src/user/user.service";
import { UserPermissionsInput } from "./dto/roles-permissions-input.dto";


@Resolver()
export class UserPermissionsResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => RolesPermissionsResponse)
  async userPermissions(
    @Args("data") data: UserPermissionsInput, 
  ): Promise<RolesPermissionsResponse> {     
    const user = await this.userService.getUserWithRolesAndPermissions(data.publicId);

    const roleNames = user?.roles?.map((r) => r.name) || [];

    const permissionNames = new Set<string>();
    user?.roles?.forEach((role) => {
      role?.permissions?.forEach((perm) => permissionNames.add(perm.name));
    });

    return {
      roles: roleNames,
      permissions: Array.from(permissionNames),
    };
  }
}

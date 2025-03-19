import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';

import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { createBaseResolver } from 'src/common/base.resolver';
import { Role } from './role.entity';

const BaseRoleResolver = createBaseResolver<
  Role,
  CreateRoleInput,
  UpdateRoleInput
>('role', Role, CreateRoleInput, UpdateRoleInput);

@Resolver(() => Role)
export class RoleResolver extends BaseRoleResolver {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }

  @Mutation(() => Role)
  async addPermissionsToRole(
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  ) {
    return this.roleService.addPermissionsToRole(roleId, permissionIds);
  }

  @Mutation(() => Role)
  async removePermissionsFromRole(
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  ) {
    return this.roleService.removePermissionsFromRole(roleId, permissionIds);
  }
}

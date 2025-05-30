import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';

import { RoleService } from './role.service';
import { CreateRoleInput } from './inputs/create-role.input';
import { UpdateRoleInput } from './inputs/update-role.input';
import { createBaseResolver } from 'src/common/base.resolver';
import { Role } from './role.entity';
import { RbacPermissionKey } from '../../decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from 'src/modules/audit/decorators/immutable-logging.decorator';
import { PermissionGroup } from '../permission-group/permission-group.entity';
import {
  IdRequestDto,
  SubmitIdArrayByIdRequestDto,
} from 'src/modules/global-dto/req.dto';

const BaseRoleResolver = createBaseResolver<
  Role,
  CreateRoleInput,
  UpdateRoleInput
>(Role, CreateRoleInput, UpdateRoleInput, {
  queryName: 'Role',
  stableKeyPrefix: 'role',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
  immutableOperations: ['create', 'update', 'remove'],
});

@Resolver(() => Role)
export class RoleResolver extends BaseRoleResolver {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }

  // @Mutation(() => Role)
  // @RbacPermissionKey('role.addPermissionsToRole')
  // @ImmutableLogging()
  // async addPermissionsToRole(
  //   @Args('roleId', { type: () => Int }) roleId: number,
  //   @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  // ) {
  //   return this.roleService.addPermissionsToRole(roleId, permissionIds);
  // }

  // @Mutation(() => Role)
  // @RbacPermissionKey('role.removePermissionsFromRole')
  // @ImmutableLogging()
  // async removePermissionsFromRole(
  //   @Args('roleId', { type: () => Int }) roleId: number,
  //   @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  // ) {
  //   return this.roleService.removePermissionsFromRole(roleId, permissionIds);
  // }

  // @Mutation(() => Role)
  // @RbacPermissionKey('role.addPermissionGroupsToRole')
  // @ImmutableLogging()
  // async addPermissionGroupsToRole(
  //   @Args('roleId', { type: () => Int }) roleId: number,
  //   @Args('groupIds', { type: () => [Int] }) groupIds: number[],
  // ) {
  //   return this.roleService.addPermissionGroupsToRole(roleId, groupIds);
  // }

  @Query(() => [PermissionGroup])
  @RbacPermissionKey('role.getPermissionGroupsForRole')
  @ImmutableLogging()
  async getPermissionGroupsForRole(@Args('data') data: IdRequestDto) {
    return this.roleService.getPermissionGroupsForRole(data.id);
  }

  @Mutation(() => Role)
  @RbacPermissionKey('role.updatePermissionGroupsForRole')
  @ImmutableLogging()
  async updatePermissionGroupsForRole(
    @Args('data') data: SubmitIdArrayByIdRequestDto,
  ) {
    return this.roleService.updatePermissionGroupsForRole(
      data.recordId,
      data.idArray,
    );
  }
}

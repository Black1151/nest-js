import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';

import { createBaseResolver } from 'src/common/base.resolver';
import { PermissionGroup } from './permission-group.entity';
import { PermissionGroupService } from './permission-group.service';

import { RbacPermissionKey } from '../../decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from 'src/modules/audit/decorators/immutable-logging.decorator';
import { CreatePermissionGroupInput } from './inputs/create-permission-group.input';
import { UpdatePermissionGroupInput } from './inputs/update-permission-group.input';

const BasePermissionGroupResolver = createBaseResolver<
  PermissionGroup,
  CreatePermissionGroupInput,
  UpdatePermissionGroupInput
>(PermissionGroup, CreatePermissionGroupInput, UpdatePermissionGroupInput, {
  queryName: 'PermissionGroup',
  stableKeyPrefix: 'permissionGroup',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
  ],
  immutableOperations: ['create', 'update', 'remove'],
});

@Resolver(() => PermissionGroup)
export class PermissionGroupResolver extends BasePermissionGroupResolver {
  constructor(private readonly pgService: PermissionGroupService) {
    super(pgService);
  }

  @Mutation(() => PermissionGroup)
  @RbacPermissionKey('permissionGroup.addPermissionsToGroup')
  @ImmutableLogging()
  async addPermissionsToGroup(
    @Args('groupId', { type: () => Int }) groupId: number,
    @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  ) {
    return this.pgService.addPermissionsToGroup(groupId, permissionIds);
  }

  @Mutation(() => PermissionGroup)
  @RbacPermissionKey('permissionGroup.removePermissionsFromGroup')
  @ImmutableLogging()
  async removePermissionsFromGroup(
    @Args('groupId', { type: () => Int }) groupId: number,
    @Args('permissionIds', { type: () => [Int] }) permissionIds: number[],
  ) {
    return this.pgService.removePermissionsFromGroup(groupId, permissionIds);
  }
}

import { Resolver } from '@nestjs/graphql';

import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './permission.entity';
import { createBaseResolver } from 'src/common/base.resolver';
import { PermissionService } from './permission.service';

const BasePermissionResolver = createBaseResolver<
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput
>(Permission, CreatePermissionInput, UpdatePermissionInput, {
  queryName: 'Permission',
  stableKeyPrefix: 'permission',
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

@Resolver(() => Permission)
export class PermissionResolver extends BasePermissionResolver {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }
}

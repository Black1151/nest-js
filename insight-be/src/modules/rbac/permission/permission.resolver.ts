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
>('permission', Permission, CreatePermissionInput, UpdatePermissionInput);

@Resolver(() => Permission)
export class PermissionResolver extends BasePermissionResolver {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }

  // Add custom queries/mutations if needed
}

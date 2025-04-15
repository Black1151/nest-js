import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePermissionInput } from './inputs/create-permission.input';
import { UpdatePermissionInput } from './inputs/update-permission.input';
import { BaseService } from 'src/common/base.service';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService extends BaseService<
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput
> {
  constructor(
    @InjectRepository(Permission)
    permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }
}

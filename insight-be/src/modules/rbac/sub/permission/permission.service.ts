import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(permissionRepository, dataSource);
  }
}

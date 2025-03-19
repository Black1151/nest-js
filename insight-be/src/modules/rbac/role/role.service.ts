import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { BaseService } from 'src/common/base.service';
import { Permission } from '../permission/permission.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends BaseService<
  Role,
  CreateRoleInput,
  UpdateRoleInput
> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(roleRepository);
  }

  /**
   * Add multiple permissions to the given role.
   */
  async addPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found.`);
    }

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    const currentPermissions = role.permissions ?? [];
    role.permissions = [...currentPermissions, ...permissions];

    return this.roleRepository.save(role);
  }

  /**
   * Remove permissions from the given role.
   */
  async removePermissionsFromRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found.`);
    }

    role.permissions = role.permissions?.filter(
      (permission) => !permissionIds.includes(permission.id),
    );

    return this.roleRepository.save(role);
  }
}

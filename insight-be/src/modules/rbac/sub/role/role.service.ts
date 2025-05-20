import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { CreateRoleInput } from './inputs/create-role.input';
import { UpdateRoleInput } from './inputs/update-role.input';
import { BaseService } from 'src/common/base.service';
import { Permission } from '../permission/permission.entity';
import { Role } from './role.entity';
import { PermissionGroup } from '../permission-group/permission-group.entity';
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

    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,

    @InjectDataSource() dataSource: DataSource,
  ) {
    super(roleRepository, dataSource);
  }

  /**
   * Add multiple permissions to the given role.
   */
  // async addPermissionsToRole(
  //   roleId: number,
  //   permissionIds: number[],
  // ): Promise<Role> {
  //   const role = await this.roleRepository.findOne({
  //     where: { id: roleId },
  //     relations: ['permissions'],
  //   });
  //   if (!role) {
  //     throw new NotFoundException(`Role with ID ${roleId} not found.`);
  //   }

  //   const permissions = await this.permissionRepository.find({
  //     where: { id: In(permissionIds) },
  //   });

  //   const currentPermissions = role.permissions ?? [];
  //   role.permissions = [...currentPermissions, ...permissions];

  //   return this.roleRepository.save(role);
  // }

  /**
   * Remove permissions from the given role.
   */
  // async removePermissionsFromRole(
  //   roleId: number,
  //   permissionIds: number[],
  // ): Promise<Role> {
  //   const role = await this.roleRepository.findOne({
  //     where: { id: roleId },
  //     relations: ['permissions'],
  //   });
  //   if (!role) {
  //     throw new NotFoundException(`Role with ID ${roleId} not found.`);
  //   }

  //   role.permissions = role.permissions?.filter(
  //     (permission) => !permissionIds.includes(permission.id),
  //   );

  //   return this.roleRepository.save(role);
  // }
  // async addPermissionGroupsToRole(
  //   roleId: number,
  //   groupIds: number[],
  // ): Promise<Role> {
  //   const role = await this.roleRepository.findOne({
  //     where: { id: roleId },
  //     relations: ['permissionGroups'],
  //   });
  //   if (!role) {
  //     throw new NotFoundException(`Role with ID ${roleId} not found.`);
  //   }

  //   const groups = await this.permissionGroupRepository.find({
  //     where: { id: In(groupIds) },
  //   });

  //   const currentGroups = role.permissionGroups ?? [];
  //   role.permissionGroups = [...currentGroups, ...groups];

  //   return this.roleRepository.save(role);
  // }

  // async removePermissionGroupsFromRole(
  //   roleId: number,
  //   groupIds: number[],
  // ): Promise<Role> {
  //   const role = await this.roleRepository.findOne({
  //     where: { id: roleId },
  //     relations: ['permissionGroups'],
  //   });
  //   if (!role) {
  //     throw new NotFoundException(`Role with ID ${roleId} not found.`);
  //   }

  //   role.permissionGroups = role.permissionGroups?.filter(
  //     (group) => !groupIds.includes(group.id),
  //   );

  //   return this.roleRepository.save(role);
  // }

  async updatePermissionGroupsForRole(
    roleId: number,
    permissionGroupIds: number[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissionGroups'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found.`);
    }

    // if they're clearing all groups:
    if (!permissionGroupIds?.length) {
      role.permissionGroups = [];
      return this.roleRepository.save(role);
    }

    // load the actual PermissionGroup entities
    const groups = await this.permissionGroupRepository.find({
      where: { id: In(permissionGroupIds) },
    });

    // check for any IDs that don't exist
    const foundIds = groups.map((g) => g.id);
    const missing = permissionGroupIds.filter((id) => !foundIds.includes(id));
    if (missing.length) {
      throw new NotFoundException(
        `PermissionGroup(s) with ID(s) ${missing.join(', ')} not found.`,
      );
    }

    role.permissionGroups = groups;
    return this.roleRepository.save(role);
  }

  async getPermissionGroupsForRole(roleId: number): Promise<PermissionGroup[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissionGroups'],
    });
    return role?.permissionGroups ?? [];
  }
}

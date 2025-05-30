import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { PermissionGroup } from './permission-group.entity';
import { Permission } from '../permission/permission.entity';
import { CreatePermissionGroupInput } from './inputs/create-permission-group.input';
import { UpdatePermissionGroupInput } from './inputs/update-permission-group.input';

@Injectable()
export class PermissionGroupService extends BaseService<
  PermissionGroup,
  CreatePermissionGroupInput,
  UpdatePermissionGroupInput
> {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(permissionGroupRepository, dataSource);
  }

  // /**
  //  * Add multiple permissions to the given permission group.
  //  */
  // async addPermissionsToGroup(
  //   groupId: number,
  //   permissionIds: number[],
  // ): Promise<PermissionGroup> {
  //   const group = await this.permissionGroupRepository.findOne({
  //     where: { id: groupId },
  //     relations: ['permissions'],
  //   });

  //   if (!group) {
  //     throw new NotFoundException(
  //       `Permission Group with ID ${groupId} not found.`,
  //     );
  //   }

  //   const permissions = await this.permissionRepository.find({
  //     where: { id: In(permissionIds) },
  //   });

  //   const currentPermissions = group.permissions ?? [];
  //   group.permissions = [...currentPermissions, ...permissions];

  //   return this.permissionGroupRepository.save(group);
  // }

  // /**
  //  * Remove permissions from the given group.
  //  */
  // async removePermissionsFromGroup(
  //   groupId: number,
  //   permissionIds: number[],
  // ): Promise<PermissionGroup> {
  //   const group = await this.permissionGroupRepository.findOne({
  //     where: { id: groupId },
  //     relations: ['permissions'],
  //   });
  //   if (!group) {
  //     throw new NotFoundException(
  //       `Permission Group with ID ${groupId} not found.`,
  //     );
  //   }

  //   group.permissions = group.permissions?.filter(
  //     (permission) => !permissionIds.includes(permission.id),
  //   );

  //   return this.permissionGroupRepository.save(group);
  // }

  /**
   * Fetch all permissions for a given permission group.
   */
  async getPermissionsForGroup(groupId: number): Promise<Permission[]> {
    const group = await this.permissionGroupRepository.findOne({
      where: { id: groupId },
      relations: ['permissions'],
    });
    if (!group) {
      throw new NotFoundException(
        `Permission Group with ID ${groupId} not found.`,
      );
    }
    return group.permissions ?? [];
  }

  /**
   * Replace this group's permissions with exactly the given IDs.
   */
  async updatePermissionsFromArray(
    groupId: number,
    permissionIds: number[],
  ): Promise<PermissionGroup> {
    const group = await this.permissionGroupRepository.findOne({
      where: { id: groupId },
      relations: ['permissions'],
    });
    if (!group) {
      throw new NotFoundException(
        `Permission Group with ID ${groupId} not found.`,
      );
    }
    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    // overwrite, rather than append/remove
    group.permissions = permissions;
    return this.permissionGroupRepository.save(group);
  }
}

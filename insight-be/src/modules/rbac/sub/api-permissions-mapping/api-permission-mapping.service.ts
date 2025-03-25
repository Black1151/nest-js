// rbac/api-permission-mapping.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiPermissionMapping } from './api-permission-mapping.entity';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class ApiPermissionMappingService {
  constructor(
    @InjectRepository(ApiPermissionMapping)
    private readonly mappingRepo: Repository<ApiPermissionMapping>,

    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  async findAll(): Promise<ApiPermissionMapping[]> {
    return this.mappingRepo.find();
  }

  // If you need to fetch a single routeKey + perms
  async findByRouteKey(routeKey: string): Promise<ApiPermissionMapping | null> {
    return this.mappingRepo.findOne({
      where: { routeKey },
      relations: ['requiredPermissions'],
    });
  }

  async saveMapping(
    mapping: ApiPermissionMapping,
  ): Promise<ApiPermissionMapping> {
    return this.mappingRepo.save(mapping);
  }

  /**
   * If the mapping doesn't exist, create it; if it does exist, return it.
   */
  async findOrCreate(routeKey: string): Promise<ApiPermissionMapping> {
    let mapping = await this.mappingRepo.findOne({
      where: { routeKey },
      relations: ['requiredPermissions'], // <--- LOAD RELATION
    });
    if (!mapping) {
      mapping = this.mappingRepo.create({ routeKey });
      mapping = await this.mappingRepo.save(mapping);

      // If you still need the relation array, reload with relations:
      mapping = await this.mappingRepo.findOne({
        where: { routeKey },
        relations: ['requiredPermissions'],
      });
    }
    return mapping as ApiPermissionMapping;
  }

  /**
   * For admin usage: sets (overwrites) the list of required permissions (by ID) for a given routeKey.
   */
  async setPermissions(
    routeKey: string,
    permissionIds: number[],
  ): Promise<ApiPermissionMapping> {
    const mapping = await this.findOrCreate(routeKey);
    const perms = await this.permRepo.findByIds(permissionIds);
    mapping.requiredPermissions = perms;
    return this.mappingRepo.save(mapping);
  }

  /**
   * Remove the mapping entirely, if it exists.
   */
  async removeMapping(routeKey: string): Promise<boolean> {
    const mapping = await this.mappingRepo.findOne({ where: { routeKey } });
    if (!mapping) return false;
    await this.mappingRepo.remove(mapping);
    return true;
  }
}

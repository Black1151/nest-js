import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { ComponentVariantEntity } from './component-variant.entity';
import {
  CreateComponentVariantInput,
  UpdateComponentVariantInput,
} from './component-variant.inputs';

@Injectable()
export class ComponentVariantService extends BaseService<
  ComponentVariantEntity,
  CreateComponentVariantInput,
  UpdateComponentVariantInput
> {
  constructor(
    @InjectRepository(ComponentVariantEntity)
    variantRepository: Repository<ComponentVariantEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(variantRepository, dataSource);
  }

  async create(data: CreateComponentVariantInput): Promise<ComponentVariantEntity> {
    const { themeId, relationIds = [], ...rest } = data;
    const relations = [...relationIds, { relation: 'theme', ids: [themeId] }];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateComponentVariantInput): Promise<ComponentVariantEntity> {
    const { themeId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      ...(themeId ? [{ relation: 'theme', ids: [themeId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }

  async findOne(id: number, relations?: string[]): Promise<ComponentVariantEntity> {
    return super.findOne(id, relations);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { StyleGroupEntity } from './style-group.entity';
import { CreateStyleGroupInput, UpdateStyleGroupInput } from './style-group.inputs';

@Injectable()
export class StyleGroupService extends BaseService<
  StyleGroupEntity,
  CreateStyleGroupInput,
  UpdateStyleGroupInput
> {
  constructor(
    @InjectRepository(StyleGroupEntity) groupRepository: Repository<StyleGroupEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(groupRepository, dataSource);
  }

  async create(data: CreateStyleGroupInput): Promise<StyleGroupEntity> {
    const { collectionId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      { relation: 'collection', ids: [collectionId] },
    ];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateStyleGroupInput): Promise<StyleGroupEntity> {
    const { collectionId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      ...(collectionId ? [{ relation: 'collection', ids: [collectionId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }
}

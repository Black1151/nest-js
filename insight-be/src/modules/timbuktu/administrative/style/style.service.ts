import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { StyleEntity } from './style.entity';
import { CreateStyleInput, UpdateStyleInput } from './style.inputs';

@Injectable()
export class StyleService extends BaseService<
  StyleEntity,
  CreateStyleInput,
  UpdateStyleInput
> {
  constructor(
    @InjectRepository(StyleEntity) styleRepository: Repository<StyleEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(styleRepository, dataSource);
  }

  async create(data: CreateStyleInput): Promise<StyleEntity> {
    const { collectionId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      { relation: 'collection', ids: [collectionId] },
    ];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateStyleInput): Promise<StyleEntity> {
    const { collectionId, relationIds = [], ...rest } = data;
    const relations = [
      ...relationIds,
      ...(collectionId ? [{ relation: 'collection', ids: [collectionId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }

  async findByIds(ids: number[]): Promise<StyleEntity[]> {
    if (!ids?.length) return [];
    return this.repo.find({ where: { id: In(ids) } });
  }
}

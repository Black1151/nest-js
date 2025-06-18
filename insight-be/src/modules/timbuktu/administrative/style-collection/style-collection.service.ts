import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { StyleCollectionEntity } from './style-collection.entity';
import { CreateStyleCollectionInput, UpdateStyleCollectionInput } from './style-collection.inputs';

@Injectable()
export class StyleCollectionService extends BaseService<
  StyleCollectionEntity,
  CreateStyleCollectionInput,
  UpdateStyleCollectionInput
> {
  constructor(
    @InjectRepository(StyleCollectionEntity)
    collectionRepository: Repository<StyleCollectionEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(collectionRepository, dataSource);
  }
}

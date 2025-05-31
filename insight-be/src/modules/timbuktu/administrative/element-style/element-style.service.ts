import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BaseService } from 'src/common/base.service';
import { ElementStyleEntity } from './element-style.entity';
import {
  CreateElementStyleInput,
  UpdateElementStyleInput,
} from './element-style.inputs';

@Injectable()
export class ElementStyleService extends BaseService<
  ElementStyleEntity,
  CreateElementStyleInput,
  UpdateElementStyleInput
> {
  constructor(
    @InjectRepository(ElementStyleEntity) repo: Repository<ElementStyleEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(repo, dataSource);
  }
}

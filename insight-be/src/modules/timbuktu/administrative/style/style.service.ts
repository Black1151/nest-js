import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
}

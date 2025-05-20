import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CreateYearGroupInput,
  UpdateYearGroupInput,
} from './year-group.inputs';
import { BaseService } from 'src/common/base.service';
import { YearGroupEntity } from './year-group.entity';

@Injectable()
export class YearGroupService extends BaseService<
  YearGroupEntity,
  CreateYearGroupInput,
  UpdateYearGroupInput
> {
  constructor(
    @InjectRepository(YearGroupEntity)
    yearGroupRepository: Repository<YearGroupEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(yearGroupRepository, dataSource);
  }
}

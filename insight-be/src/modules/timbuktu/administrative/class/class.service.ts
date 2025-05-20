import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { ClassEntity } from './class.entity';
import { CreateClassInput, UpdateClassInput } from './class.inputs';

@Injectable()
export class ClassService extends BaseService<
  ClassEntity,
  CreateClassInput,
  UpdateClassInput
> {
  constructor(
    @InjectRepository(ClassEntity)
    classRepository: Repository<ClassEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(classRepository, dataSource);
  }
}

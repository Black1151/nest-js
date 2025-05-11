import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {
    super(classRepository);
  }
}

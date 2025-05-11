import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/common/base.service';
import { SubjectEntity } from './subject.entity';
import { CreateSubjectInput, UpdateSubjectInput } from './subject.inputs';

@Injectable()
export class SubjectService extends BaseService<
  SubjectEntity,
  CreateSubjectInput,
  UpdateSubjectInput
> {
  constructor(
    @InjectRepository(SubjectEntity)
    subjectRepository: Repository<SubjectEntity>,
  ) {
    super(subjectRepository);
  }
}

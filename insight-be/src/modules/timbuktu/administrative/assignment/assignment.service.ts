import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from './assignment.inputs';
import { AssignmentEntity } from './assignment.entity';

@Injectable()
export class AssignmentService extends BaseService<
  AssignmentEntity,
  CreateAssignmentInput,
  UpdateAssignmentInput
> {
  constructor(
    @InjectRepository(AssignmentEntity)
    assignmentRepository: Repository<AssignmentEntity>,
  ) {
    super(assignmentRepository);
  }
}

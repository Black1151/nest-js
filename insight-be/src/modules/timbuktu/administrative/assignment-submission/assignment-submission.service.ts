import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { AssignmentSubmissionEntity } from './assignment-submission.entity';
import {
  CreateAssignmentSubmissionInput,
  UpdateAssignmentSubmissionInput,
} from './assignment-submission.inputs';

@Injectable()
export class AssignmentSubmissionService extends BaseService<
  AssignmentSubmissionEntity,
  CreateAssignmentSubmissionInput,
  UpdateAssignmentSubmissionInput
> {
  constructor(
    @InjectRepository(AssignmentSubmissionEntity)
    assignmentSubmissionRepository: Repository<AssignmentSubmissionEntity>,
  ) {
    super(assignmentSubmissionRepository);
  }
}

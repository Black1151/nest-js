import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(assignmentSubmissionRepository, dataSource);
  }
}

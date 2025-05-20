import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(assignmentRepository, dataSource);
  }
}

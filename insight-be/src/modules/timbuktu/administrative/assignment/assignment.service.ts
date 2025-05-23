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

  async create(data: CreateAssignmentInput): Promise<AssignmentEntity> {
    const relationIds = [] as { relation: string; ids: number[] }[];
    if (data.classId) {
      relationIds.push({ relation: 'class', ids: [data.classId] });
    }

    if (data.lessonIds?.length) {
      relationIds.push({ relation: 'lessons', ids: data.lessonIds });
    }
    if (data.educatorIds?.length) {
      relationIds.push({ relation: 'educators', ids: data.educatorIds });
    }
    if (data.studentIds?.length) {
      relationIds.push({ relation: 'students', ids: data.studentIds });
    }

    const scalar = {
      name: data.name,
      description: data.description,
      dueDate: data.dueDate,
    } as any;

    return super.create({ ...(scalar as any), relationIds } as any);
  }

  async update(data: UpdateAssignmentInput): Promise<AssignmentEntity> {
    const relationIds = [] as { relation: string; ids: number[] }[];
    if (data.classId) {
      relationIds.push({ relation: 'class', ids: [data.classId] });
    }

    if (data.lessonIds?.length) {
      relationIds.push({ relation: 'lessons', ids: data.lessonIds });
    }
    if (data.educatorIds?.length) {
      relationIds.push({ relation: 'educators', ids: data.educatorIds });
    }
    if (data.studentIds?.length) {
      relationIds.push({ relation: 'students', ids: data.studentIds });
    }

    const scalar = {
      id: data.id,
      name: data.name,
      description: data.description,
      dueDate: data.dueDate,
    } as any;

    return super.update({ ...(scalar as any), relationIds } as any);
  }
}

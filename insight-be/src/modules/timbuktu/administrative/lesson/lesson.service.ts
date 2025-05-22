import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { LessonEntity } from './lesson.entity';
import {
  CreateLessonInput,
  UpdateLessonInput,
  LessonByTopicInput,
} from './lesson.inputs';

@Injectable()
export class LessonService extends BaseService<
  LessonEntity,
  CreateLessonInput,
  UpdateLessonInput
> {
  constructor(
    @InjectRepository(LessonEntity)
    lessonRepository: Repository<LessonEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(lessonRepository, dataSource);
  }

  async findByTopic(input: LessonByTopicInput): Promise<LessonEntity[]> {
    const { topicId, pagination } = input;

    const qb = this.repo
      .createQueryBuilder('lesson')
      .where('lesson.topicId = :topicId', { topicId });

    if (pagination) {
      if (pagination.limit !== undefined) qb.take(pagination.limit);
      if (pagination.offset !== undefined) qb.skip(pagination.offset);
    }

    return qb.orderBy('lesson.title', 'ASC').getMany();
  }
}

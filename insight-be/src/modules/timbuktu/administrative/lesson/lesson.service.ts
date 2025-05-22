import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { LessonEntity } from './lesson.entity';
import { CreateLessonInput, UpdateLessonInput } from './lesson.inputs';

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

  async findByTopic(topicId: number): Promise<LessonEntity[]> {
    return this.repo.find({
      where: { topic: { id: topicId } },
      order: { title: 'ASC' },
    });
  }
}

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

  async create(data: CreateLessonInput): Promise<LessonEntity> {
    const { themeId, relationIds = [], ...rest } = data as any;
    const relations = [...relationIds, { relation: 'theme', ids: [themeId] }];
    return super.create({ ...rest, relationIds: relations } as any);
  }

  async update(data: UpdateLessonInput): Promise<LessonEntity> {
    const { themeId, relationIds = [], ...rest } = data as any;
    const relations = [
      ...relationIds,
      ...(themeId ? [{ relation: 'theme', ids: [themeId] }] : []),
    ];
    return super.update({ ...rest, relationIds: relations } as any);
  }
}

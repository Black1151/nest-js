import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { TopicEntity } from './topic.entity';
import {
  CreateTopicInput,
  UpdateTopicInput,
  TopicByYearSubjectInput,
} from './topic.inputs';

@Injectable()
export class TopicService extends BaseService<
  TopicEntity,
  CreateTopicInput,
  UpdateTopicInput
> {
  constructor(
    @InjectRepository(TopicEntity)
    topicRepository: Repository<TopicEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(topicRepository, dataSource);
  }

  async findByYearAndSubject(
    input: TopicByYearSubjectInput,
  ): Promise<TopicEntity[]> {
    const { yearGroupId, subjectId, withLessons = false } = input;

    const qb = this.repo
      .createQueryBuilder('topic')
      .innerJoin('topic.yearGroup', 'yg', 'yg.id = :yearGroupId', { yearGroupId })
      .innerJoin('topic.subject', 'sub', 'sub.id = :subjectId', { subjectId });

    if (withLessons) {
      qb.leftJoinAndSelect('topic.lessons', 'les');
    }

    return qb.orderBy('topic.name', 'ASC').getMany();
  }
}

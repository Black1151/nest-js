import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BaseService } from 'src/common/base.service';
import { QuizEntity } from './quiz.entity';
import { CreateQuizInput, UpdateQuizInput } from './quiz.inputs';

@Injectable()
export class QuizService extends BaseService<
  QuizEntity,
  CreateQuizInput,
  UpdateQuizInput
> {
  constructor(
    @InjectRepository(QuizEntity) quizRepository: Repository<QuizEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(quizRepository, dataSource);
  }
}

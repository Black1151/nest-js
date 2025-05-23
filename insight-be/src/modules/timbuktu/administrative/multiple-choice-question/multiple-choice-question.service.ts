import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { MultipleChoiceQuestionEntity } from './multiple-choice-question.entity';
import {
  CreateMultipleChoiceQuestionInput,
  UpdateMultipleChoiceQuestionInput,
} from './multiple-choice-question.inputs';

@Injectable()
export class MultipleChoiceQuestionService extends BaseService<
  MultipleChoiceQuestionEntity,
  CreateMultipleChoiceQuestionInput,
  UpdateMultipleChoiceQuestionInput
> {
  constructor(
    @InjectRepository(MultipleChoiceQuestionEntity)
    mcqRepository: Repository<MultipleChoiceQuestionEntity>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(mcqRepository, dataSource);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultipleChoiceQuestionEntity } from './multiple-choice-question.entity';
import { MultipleChoiceQuestionService } from './multiple-choice-question.service';
import { MultipleChoiceQuestionResolver } from './multiple-choice-question.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MultipleChoiceQuestionEntity])],
  providers: [MultipleChoiceQuestionService, MultipleChoiceQuestionResolver],
  exports: [MultipleChoiceQuestionService],
})
export class MultipleChoiceQuestionModule {}

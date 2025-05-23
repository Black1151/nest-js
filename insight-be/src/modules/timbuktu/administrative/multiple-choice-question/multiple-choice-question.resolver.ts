import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { MultipleChoiceQuestionService } from './multiple-choice-question.service';
import { MultipleChoiceQuestionEntity } from './multiple-choice-question.entity';
import {
  CreateMultipleChoiceQuestionInput,
  UpdateMultipleChoiceQuestionInput,
} from './multiple-choice-question.inputs';

const BaseMultipleChoiceQuestionResolver = createBaseResolver<
  MultipleChoiceQuestionEntity,
  CreateMultipleChoiceQuestionInput,
  UpdateMultipleChoiceQuestionInput
>(
  MultipleChoiceQuestionEntity,
  CreateMultipleChoiceQuestionInput,
  UpdateMultipleChoiceQuestionInput,
  {
    queryName: 'MultipleChoiceQuestion',
    stableKeyPrefix: 'multipleChoiceQuestion',
    enabledOperations: [
      'findAll',
      'findOne',
      'findOneBy',
      'create',
      'update',
      'remove',
      'search',
    ],
  },
);

@Resolver(() => MultipleChoiceQuestionEntity)
export class MultipleChoiceQuestionResolver extends BaseMultipleChoiceQuestionResolver {
  constructor(private readonly mcqService: MultipleChoiceQuestionService) {
    super(mcqService);
  }
}

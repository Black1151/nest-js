import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { QuizEntity } from './quiz.entity';
import { QuizService } from './quiz.service';
import { CreateQuizInput, UpdateQuizInput } from './quiz.inputs';

const BaseQuizResolver = createBaseResolver<
  QuizEntity,
  CreateQuizInput,
  UpdateQuizInput
>(QuizEntity, CreateQuizInput, UpdateQuizInput, {
  queryName: 'Quiz',
  stableKeyPrefix: 'quiz',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
});

@Resolver(() => QuizEntity)
export class QuizResolver extends BaseQuizResolver {
  constructor(private readonly quizService: QuizService) {
    super(quizService);
  }
}

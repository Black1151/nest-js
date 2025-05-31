import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { CreateLessonInput, UpdateLessonInput } from './lesson.inputs';
import { LessonEntity } from './lesson.entity';
import { LessonService } from './lesson.service';
import { OpenAiService } from '../../../openai/openai.service';
import { GeneratedLesson } from '../../../openai/openai.types';

const BaseLessonResolver = createBaseResolver<
  LessonEntity,
  CreateLessonInput,
  UpdateLessonInput
>(LessonEntity, CreateLessonInput, UpdateLessonInput, {
  queryName: 'Lesson',
  stableKeyPrefix: 'lesson',
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

@Resolver(() => LessonEntity)
export class LessonResolver extends BaseLessonResolver {
  constructor(
    private readonly lessonService: LessonService,
    private readonly openAiService: OpenAiService,
  ) {
    super(lessonService);
  }

  @Mutation(() => GeneratedLesson)
  async generateLessonFromPrompt(
    @Args('prompt') prompt: string,
  ): Promise<GeneratedLesson> {
    return this.openAiService.generateLesson(prompt);
  }
}

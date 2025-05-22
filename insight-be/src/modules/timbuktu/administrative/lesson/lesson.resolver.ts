import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { CreateLessonInput, UpdateLessonInput } from './lesson.inputs';
import { LessonEntity } from './lesson.entity';
import { LessonService } from './lesson.service';

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
  constructor(private readonly lessonService: LessonService) {
    super(lessonService);
  }

  @Query(() => [LessonEntity])
  async lessonsByTopic(
    @Args('topicId', { type: () => ID }) topicId: string,
  ): Promise<LessonEntity[]> {
    return this.lessonService.findByTopic(Number(topicId));
  }
}

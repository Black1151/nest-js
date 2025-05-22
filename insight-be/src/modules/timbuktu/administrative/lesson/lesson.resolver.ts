import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { CreateLessonInput, UpdateLessonInput } from './lesson.inputs';
import { LessonEntity } from './lesson.entity';
import { LessonService } from './lesson.service';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

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

  @RbacPermissionKey('lesson.lessonsByTopic')
  @Query(() => [LessonEntity])
  async lessonsByTopic(
    @Args('topicId', { type: () => ID }) topicId: string,
  ): Promise<LessonEntity[]> {
    return this.lessonService.findByTopic(Number(topicId));
  }
}

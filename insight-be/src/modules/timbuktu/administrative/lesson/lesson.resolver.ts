import { Args, Query, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import {
  CreateLessonInput,
  UpdateLessonInput,
  LessonByTopicInput,
} from './lesson.inputs';
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

  @RbacPermissionKey('lesson.findAllByTopic')
  @Query(() => [LessonEntity])
  async lessonsByTopic(
    @Args('input') input: LessonByTopicInput,
  ): Promise<LessonEntity[]> {
    return this.lessonService.findByTopic(input);
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { CreateLessonInput, UpdateLessonInput, UpgradeLessonThemeInput } from './lesson.inputs';
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

  @Mutation(() => LessonEntity, {
    name: 'upgradeLessonTheme',
    description: 'Upgrade the lesson\'s theme version',
  })
  async upgradeLessonTheme(
    @Args('data', { type: () => UpgradeLessonThemeInput }) data: UpgradeLessonThemeInput,
  ): Promise<LessonEntity> {
    return this.lessonService.upgradeThemeVersion(data.lessonId);
  }
}

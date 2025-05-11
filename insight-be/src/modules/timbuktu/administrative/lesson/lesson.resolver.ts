import { Resolver } from '@nestjs/graphql';
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
  ],
});

@Resolver(() => LessonEntity)
export class LessonResolver extends BaseLessonResolver {
  constructor(private readonly lessonService: LessonService) {
    super(lessonService);
  }
}

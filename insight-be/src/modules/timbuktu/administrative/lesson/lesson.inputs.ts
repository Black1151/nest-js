import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';
import { SlideInput } from './dto/slide.dto';

@InputType()
export class CreateLessonInput extends HasRelationsInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [SlideInput], { nullable: true })
  content?: SlideInput[];

  @Field(() => ID)
  themeId: number;

  @Field({ nullable: true })
  themeVersion?: number;

  @Field(() => [ID], { nullable: 'itemsAndList' })
  recommendedYearGroupIds?: number[];

  @Field(() => ID, { nullable: true })
  createdByEducatorId?: number;
}

@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {
  @Field(() => ID)
  id: number;
}

@InputType()
export class UpgradeLessonThemeInput {
  @Field(() => ID)
  lessonId: number;
}

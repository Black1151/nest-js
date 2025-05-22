import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateLessonInput extends HasRelationsInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  content?: Record<string, any>;

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

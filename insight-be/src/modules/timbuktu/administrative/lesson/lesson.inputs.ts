import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PaginationInput } from 'src/common/utils/pagination.util';

@InputType()
export class CreateLessonInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  content?: Record<string, any>;

  /**
   * Topic that this lesson belongs to
   */
  @Field(() => ID)
  topicId!: number;

  /**
   * If you allow a lesson to be recommended for multiple YearGroups:
   * This would match the ManyToMany in the entity
   */
  @Field(() => [ID], { nullable: 'itemsAndList' })
  recommendedYearGroupIds?: number[];

  /**
   * If you want to store the educator who created the lesson:
   */
  @Field(() => ID, { nullable: true })
  createdByEducatorId?: number;
}

@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {
  @Field(() => ID)
  id: number;
}

@InputType()
export class LessonByTopicInput {
  @Field(() => ID)
  topicId!: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

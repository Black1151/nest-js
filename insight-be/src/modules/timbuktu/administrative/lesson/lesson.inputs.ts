import { PartialType, InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateLessonInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  /**
   * Optional "subjectId" if you want to link the lesson to a subject
   */
  @Field(() => ID, { nullable: true })
  subjectId?: number;

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

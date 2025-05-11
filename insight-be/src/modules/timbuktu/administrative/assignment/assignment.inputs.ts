import { PartialType, InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateAssignmentInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  /**
   * The class this assignment is for
   */
  @Field(() => ID)
  classId: number;

  /**
   * The lesson upon which this assignment is based
   */
  @Field(() => ID)
  lessonId: number;

  /**
   * The due date
   */
  @Field({ nullable: true })
  dueDate?: Date;
}

@InputType()
export class UpdateAssignmentInput extends PartialType(CreateAssignmentInput) {
  @Field(() => ID)
  id: number;
}

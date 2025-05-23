import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateAssignmentInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  /**
   * The class this assignment is for
   */
  @Field(() => ID)
  classId: number;


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

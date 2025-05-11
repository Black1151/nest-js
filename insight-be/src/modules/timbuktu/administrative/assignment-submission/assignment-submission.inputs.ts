import { PartialType, InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateAssignmentSubmissionInput {
  @Field(() => ID)
  assignmentId: number;

  @Field(() => ID)
  studentId: number;

  @Field({ nullable: true })
  submissionContent?: string;

  @Field({ nullable: true })
  submittedAt?: Date;

  @Field({ nullable: true })
  grade?: string;

  @Field({ nullable: true })
  feedback?: string;
}

@InputType()
export class UpdateAssignmentSubmissionInput extends PartialType(
  CreateAssignmentSubmissionInput,
) {
  @Field(() => ID)
  id: number;
}

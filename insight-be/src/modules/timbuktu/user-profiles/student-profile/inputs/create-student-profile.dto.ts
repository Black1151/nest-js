import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStudentProfileInput {
  @Field()
  studentId: number;

  @Field()
  schoolYear: number;
}

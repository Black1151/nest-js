import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateStudentProfileInput } from './create-student-profile.dto';

@InputType()
export class UpdateStudentProfileInput extends PartialType(
  CreateStudentProfileInput,
) {
  @Field(() => Int)
  id: number;
}

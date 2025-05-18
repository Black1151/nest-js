import { Field, InputType } from '@nestjs/graphql';
import { UpdateUserRequestDto } from '../dto/req/req.dto';
import { CreateEducatorProfileInput } from 'src/modules/timbuktu/user-profiles/educator-profile/inputs/create-educator-profile.input';
import { CreateStudentProfileInput } from 'src/modules/timbuktu/user-profiles/student-profile/inputs/create-student-profile.dto';

@InputType()
export class UpdateUserWithProfileInput extends UpdateUserRequestDto {
  @Field(() => CreateStudentProfileInput, { nullable: true })
  studentProfile?: CreateStudentProfileInput;

  @Field(() => CreateEducatorProfileInput, { nullable: true })
  educatorProfile?: CreateEducatorProfileInput;
}

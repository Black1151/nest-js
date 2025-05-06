import { Field, InputType } from '@nestjs/graphql';
import { CreateUserRequestDto } from '../dto/req/req.dto';
import { CreateStudentProfileInput } from 'src/modules/timbuktu/user-profiles/student-profile/inputs/create-student-profile.dto';
import { CreateEducatorProfileInput } from 'src/modules/timbuktu/user-profiles/educator-profile/inputs/create-educator-profile.input';

@InputType()
export class CreateUserWithProfileInput extends CreateUserRequestDto {
  @Field(() => CreateStudentProfileInput, { nullable: true })
  studentProfile?: CreateStudentProfileInput;

  @Field(() => CreateEducatorProfileInput, { nullable: true })
  educatorProfile?: CreateEducatorProfileInput;
}

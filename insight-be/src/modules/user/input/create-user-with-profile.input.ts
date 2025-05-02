import { Field, InputType } from '@nestjs/graphql';
import { CreateUserRequestDto } from '../dto/req/req.dto';

@InputType()
export class CreateUserWithProfileInput extends CreateUserRequestDto {
  @Field(() => String, { nullable: true })
  studentId?: string;

  @Field(() => String, { nullable: true })
  staffId?: string;
}

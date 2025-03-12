// dto/login-request.dto.ts
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginRequest {
  @Field()
  email: string;

  @Field()
  password: string;
}

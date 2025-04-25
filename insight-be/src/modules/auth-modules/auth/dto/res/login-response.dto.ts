import { ObjectType, Field } from '@nestjs/graphql';
import { AuthTokens } from './auth-tokens.dto';

@ObjectType()
export class UserDetails {
  @Field()
  publicId: string;

  @Field(() => [String])
  permissions: string[];
}

@ObjectType()
export class LoginResponse extends AuthTokens {
  @Field(() => UserDetails)
  userDetails: UserDetails;
}

import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EmailInput {
  @Field()
  email: string;
}

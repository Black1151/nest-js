import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EmailInput {
  @Field()
  email: string;
}

@InputType()
export class IdInput {
  @Field(() => Int)
  id: number;
}

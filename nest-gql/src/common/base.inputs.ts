// base.inputs.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FindAllInput {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}

@InputType()
export class IdInput {
  @Field(() => Int)
  id: number;
}

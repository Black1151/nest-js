import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

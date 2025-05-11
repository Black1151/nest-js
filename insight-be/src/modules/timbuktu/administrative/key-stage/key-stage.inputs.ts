import { Field, InputType, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class CreateKeyStageInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateKeyStageInput extends PartialType(CreateKeyStageInput) {
  @Field(() => ID)
  id: number;
}

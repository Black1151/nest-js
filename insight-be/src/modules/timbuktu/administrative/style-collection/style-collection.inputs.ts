import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateStyleCollectionInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  colorTokens?: string[];
}

@InputType()
export class UpdateStyleCollectionInput extends PartialType(
  CreateStyleCollectionInput,
) {
  @Field(() => ID)
  id: number;
}

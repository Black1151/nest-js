import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateStyleCollectionInput extends HasRelationsInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateStyleCollectionInput extends PartialType(
  CreateStyleCollectionInput,
) {
  @Field(() => ID)
  id!: number;
}

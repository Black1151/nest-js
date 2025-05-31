import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateElementStyleInput extends HasRelationsInput {
  @Field()
  name!: string;

  @Field()
  elementType!: string;

  @Field(() => GraphQLJSONObject)
  styles!: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  wrapperStyles?: Record<string, any>;

  @Field(() => ID)
  collectionId!: number;
}

@InputType()
export class UpdateElementStyleInput extends PartialType(
  CreateElementStyleInput,
) {
  @Field(() => ID)
  id!: number;
}

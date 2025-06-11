import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateComponentVariantInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field()
  baseComponent: string;

  @Field(() => GraphQLJSONObject)
  props: Record<string, any>;

  @Field()
  accessibleName: string;

  @Field(() => ID)
  themeId: number;
}

@InputType()
export class UpdateComponentVariantInput extends PartialType(CreateComponentVariantInput) {
  @Field(() => ID)
  id: number;
}

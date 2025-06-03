import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { PageElementType } from './style.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateStyleInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => PageElementType)
  element: PageElementType;

  @Field(() => GraphQLJSONObject)
  config: Record<string, any>;

  @Field(() => ID)
  collectionId: number;
}

@InputType()
export class UpdateStyleInput extends PartialType(CreateStyleInput) {
  @Field(() => ID)
  id: number;
}

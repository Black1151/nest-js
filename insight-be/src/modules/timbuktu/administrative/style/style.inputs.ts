import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { ElementType } from './style.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateStyleInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => ElementType)
  element: ElementType;

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

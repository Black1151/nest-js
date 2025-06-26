import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { HasRelationsInput, FindAllInput } from 'src/common/base.inputs';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateColorPaletteInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => GraphQLJSONObject)
  colors: Record<string, string>;

  @Field(() => ID)
  collectionId: number;
}

@InputType()
export class UpdateColorPaletteInput extends PartialType(CreateColorPaletteInput) {
  @Field(() => ID)
  id: number;
}

@InputType()
export class FindAllColorPaletteInput extends FindAllInput {
  @Field(() => ID, { nullable: true })
  collectionId?: number;
}

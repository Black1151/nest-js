import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateColorPaletteInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => [String])
  colors: string[];

  @Field(() => ID)
  collectionId: number;
}

@InputType()
export class UpdateColorPaletteInput extends PartialType(CreateColorPaletteInput) {
  @Field(() => ID)
  id: number;
}

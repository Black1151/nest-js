import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { HasRelationsInput, FindAllInput } from 'src/common/base.inputs';

@InputType()
export class PaletteColorInput {
  @Field()
  name!: string;

  @Field()
  value!: string;
}

@InputType()
export class CreateColorPaletteInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => [PaletteColorInput])
  colors: PaletteColorInput[];

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

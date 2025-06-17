import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { HasRelationsInput, FindAllInput } from 'src/common/base.inputs';

@InputType()
export class CreateColorPaletteInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => [String])
  colors: string[];

  @Field(() => ID)
  themeId: number;
}

@InputType()
export class UpdateColorPaletteInput extends PartialType(CreateColorPaletteInput) {
  @Field(() => ID)
  id: number;

  @Field(() => ID, { nullable: true })
  themeId?: number;
}

@InputType()
export class FindAllColorPaletteInput extends FindAllInput {}

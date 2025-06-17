import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateThemeInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  defaultPaletteId?: number;

}

@InputType()
export class UpdateThemeInput extends PartialType(CreateThemeInput) {
  @Field(() => ID)
  id: number;
}

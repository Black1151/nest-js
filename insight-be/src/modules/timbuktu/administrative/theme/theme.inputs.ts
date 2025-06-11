import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { HasRelationsInput, FindAllInput } from 'src/common/base.inputs';

@InputType()
export class CreateThemeInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => GraphQLJSONObject)
  foundationTokens: Record<string, any>;

  @Field(() => GraphQLJSONObject)
  semanticTokens: Record<string, any>;

  @Field({ defaultValue: 1 })
  version?: number;

  @Field(() => ID)
  styleCollectionId: number;

  @Field(() => ID)
  defaultPaletteId: number;

}

@InputType()
export class UpdateThemeInput extends PartialType(CreateThemeInput) {
  @Field(() => ID)
  id: number;
}

@InputType()
export class FindAllThemeInput extends FindAllInput {
  @Field(() => ID, { nullable: true })
  styleCollectionId?: number;
}

@InputType()
export class UpgradeThemeVersionInput {
  @Field(() => ID)
  id: number;

  @Field()
  version: number;
}

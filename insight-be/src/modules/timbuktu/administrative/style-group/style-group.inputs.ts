import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { PageElementType } from '../style/page-element-type';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateStyleGroupInput extends HasRelationsInput {
  @Field()
  name: string;

  @Field(() => PageElementType)
  element: PageElementType;

  @Field(() => ID)
  collectionId: number;
}

@InputType()
export class UpdateStyleGroupInput extends PartialType(CreateStyleGroupInput) {
  @Field(() => ID)
  id: number;
}

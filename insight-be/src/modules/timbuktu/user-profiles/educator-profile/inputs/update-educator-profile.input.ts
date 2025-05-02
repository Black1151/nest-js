import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateEducatorProfileInput } from './create-educator-profile.input';

@InputType()
export class UpdateEducatorProfileInput extends PartialType(
  CreateEducatorProfileInput,
) {
  @Field(() => Int)
  id: number;
}

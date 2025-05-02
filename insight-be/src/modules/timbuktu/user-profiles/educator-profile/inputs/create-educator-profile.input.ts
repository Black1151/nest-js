import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEducatorProfileInput {
  @Field()
  staffId: number;
}

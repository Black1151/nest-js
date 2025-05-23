import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateQuizInput extends HasRelationsInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  lessonId: number;
}

@InputType()
export class UpdateQuizInput extends PartialType(CreateQuizInput) {
  @Field(() => ID)
  id: number;
}

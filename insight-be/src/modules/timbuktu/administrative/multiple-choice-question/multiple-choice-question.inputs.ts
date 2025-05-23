import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateMultipleChoiceQuestionInput extends HasRelationsInput {
  @Field()
  text: string;

  @Field(() => [String])
  options: string[];

  @Field()
  correctAnswer: string;

  @Field(() => ID)
  lessonId: number;
}

@InputType()
export class UpdateMultipleChoiceQuestionInput extends PartialType(
  CreateMultipleChoiceQuestionInput,
) {
  @Field(() => ID)
  id: number;
}

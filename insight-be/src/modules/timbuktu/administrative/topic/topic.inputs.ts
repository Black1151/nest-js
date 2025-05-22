import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { HasRelationsInput } from 'src/common/base.inputs';
import { PaginationInput } from 'src/common/utils/pagination.util';

@InputType()
export class CreateTopicInput extends HasRelationsInput {
  @Field()
  name!: string;
}

@InputType()
export class UpdateTopicInput extends PartialType(CreateTopicInput) {
  @Field(() => ID)
  id!: number;
}

@InputType()
export class TopicByYearSubjectInput {
  @Field(() => ID)
  yearGroupId!: string;

  @Field(() => ID)
  subjectId!: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  withLessons?: boolean;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

import { ID, InputType, PartialType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { HasRelationsInput } from 'src/common/base.inputs';
import { PaginationInput } from 'src/common/utils/pagination.util';

@InputType()
export class CreateClassInput extends HasRelationsInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateClassInput extends PartialType(CreateClassInput) {
  @Field(() => ID)
  id: number;
}

@InputType()
export class ClassByYearSubjectInput {
  @Field(() => ID)
  yearGroupId!: string;

  @Field(() => ID)
  subjectId!: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  withStudents?: boolean;

  /** Set to true if you also want `educators` on the result. */
  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  withEducators?: boolean;

  /* 🆕 pagination */
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { HasRelationsInput } from 'src/common/base.inputs';

@InputType()
export class CreateSubjectInput extends HasRelationsInput {
  @Field()
  @IsString()
  @MinLength(1)
  name!: string;
}

@InputType()
export class UpdateSubjectInput extends PartialType(CreateSubjectInput) {
  @Field(() => ID)
  id!: number;
}

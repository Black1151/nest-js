import { ID, InputType, PartialType, Field } from '@nestjs/graphql';

@InputType()
export class CreateClassInput {
  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  yearGroupId?: number;

  @Field(() => ID, { nullable: true })
  subjectId?: number;

  @Field(() => [ID], { nullable: 'itemsAndList' })
  educatorIds?: number[];

  @Field(() => [ID], { nullable: 'itemsAndList' })
  studentIds?: number[];
}

@InputType()
export class UpdateClassInput extends PartialType(CreateClassInput) {
  @Field(() => ID)
  id: number;
}

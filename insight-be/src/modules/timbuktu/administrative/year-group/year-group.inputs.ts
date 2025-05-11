// year-group.inputs.ts

import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { ValidYear } from './year-group.entity';

@InputType()
export class CreateYearGroupInput {
  /** One of “Year 7”…“Year 13” */
  @Field(() => ValidYear)
  year: ValidYear;

  // /**
  //  * Optional free-text label (e.g. “Y7”, “7th Grade”).
  //  * Omit this if you want to default to the enum value.
  //  */
  // @Field({ nullable: true })
  // label?: string;

  /** Link this YearGroup to an existing KeyStage (optional) */
  @Field(() => ID, { nullable: true })
  keyStageId?: number;
}

@InputType()
export class UpdateYearGroupInput extends PartialType(CreateYearGroupInput) {
  /** Primary key of the YearGroup you’re updating */
  @Field(() => ID)
  id: number;
}

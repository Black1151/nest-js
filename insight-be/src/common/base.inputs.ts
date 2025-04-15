// base.inputs.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FindAllInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Maximum number of records to return',
  })
  limit?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Number of records to skip',
  })
  offset?: number;

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Set to true to return all records, ignoring pagination values',
  })
  all?: boolean;
}

@InputType()
export class FindOneByInput {
  @Field()
  column: string;

  @Field()
  value: string;
}

@InputType()
export class IdInput {
  @Field(() => Int)
  id: number;
}

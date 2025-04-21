import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePermissionGroupInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

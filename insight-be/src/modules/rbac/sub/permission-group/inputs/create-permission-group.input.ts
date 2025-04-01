import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePermissionGroupInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

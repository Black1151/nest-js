import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreatePermissionGroupInput } from './create-permission-group.input';

@InputType()
export class UpdatePermissionGroupInput extends PartialType(
  CreatePermissionGroupInput,
) {
  @Field(() => Int)
  id: number;
}

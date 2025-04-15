import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from '../../role/inputs/create-role.input';

@InputType()
export class UpdatePermissionInput extends PartialType(CreateRoleInput) {
  @Field(() => Int)
  id: number;
}

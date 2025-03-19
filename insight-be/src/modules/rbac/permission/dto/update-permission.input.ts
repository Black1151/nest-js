import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from '../../role/dto/create-role.input';

@InputType()
export class UpdatePermissionInput extends PartialType(CreateRoleInput) {
  @Field(() => Int)
  id: number;
}

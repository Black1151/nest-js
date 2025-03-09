// update-user.dto.ts
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => ID)
  id: number;
}

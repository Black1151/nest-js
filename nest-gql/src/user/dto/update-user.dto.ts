import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'ID must be a positive integer' })
  id: number;
}

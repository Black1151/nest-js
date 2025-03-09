import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class DeleteUserDto {
  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'ID must be a positive integer' })
  id: number;
}

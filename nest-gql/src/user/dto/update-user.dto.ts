import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'ID must be a positive integer' })
  id: number;

  @Field(() => String, { nullable: true })
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  email?: string;
}

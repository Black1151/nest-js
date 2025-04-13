import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';

@InputType()
export class DeleteUserDto {
  @Field(() => String)
  @IsString()
  publicId: string;
}

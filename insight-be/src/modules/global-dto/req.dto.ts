// use Nest’s decorators, not type-graphql’s
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';

@InputType()
export class IdRequestDto {
  @Field(() => Int)
  @IsNumber()
  id: number;
}

@InputType()
export class SubmitIdArrayByIdRequestDto {
  @Field(() => Int)
  @IsNumber()
  recordId: number;

  @Field(() => [Int])
  @IsArray()
  idArray: number[];
}

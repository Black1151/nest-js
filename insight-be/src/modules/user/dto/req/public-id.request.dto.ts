import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class PublicIdRequestDto {
  @Field(() => String)
  @IsString()
  publicId: string;
}

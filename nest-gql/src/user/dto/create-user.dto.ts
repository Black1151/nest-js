import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Field({ nullable: true })
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;
}

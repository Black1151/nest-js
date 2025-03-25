// create-user.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsStrongPassword } from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import { IsPhoneNumberValid } from 'src/validators/phone-number/phone.decorator';
import { TransformPhoneNumber } from 'src/validators/phone-number/phone.transformer';
import { Column } from 'typeorm';

@InputType()
export class CreateUserDto {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  @IsPhoneNumberValid()
  @TransformPhoneNumber('country')
  phoneNumber?: string;

  @Field({ nullable: true })
  addressLine1?: string;

  @Field({ nullable: true })
  addressLine2?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  county?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  country?: CountryCode;

  @Field({ nullable: true })
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @Field()
  @IsString()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

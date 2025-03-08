// create-user.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsISO8601 } from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import { IsPhoneNumberValid } from 'src/validators/phone-number/phone.decorator';
import { TransformPhoneNumber } from 'src/validators/phone-number/phone.transformer';

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
  @IsISO8601()
  @Type(() => Date)
  dateOfBirth?: Date;
}

// create-user.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import { IsPhoneNumberValid } from 'src/validators/phone-number/phone.decorator';
import { TransformPhoneNumber } from 'src/validators/phone-number/phone.transformer';
import { Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';
import { OmitType } from '@nestjs/graphql';

@InputType()
export class CreateUserRequestDto {
  @Field()
  userType: 'student' | 'educator';

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsPhoneNumberValid()
  @TransformPhoneNumber('country')
  @IsOptional()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  addressLine1?: string;

  @Field({ nullable: true })
  @IsOptional()
  addressLine2?: string;

  @Field({ nullable: true })
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  county?: string;

  @Field({ nullable: true })
  @IsOptional()
  postalCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  country?: CountryCode;

  @Field({ nullable: true })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
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

@InputType()
export class PaginatedGetAllRequestDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Offset must be at least 0' })
  offset?: number;
}

@InputType()
export class PublicIdRequestDto {
  @Field(() => String)
  @IsString()
  publicId: string;
}

@InputType()
export class UpdateUserRolesFromArrayRequestDto {
  @Field(() => String)
  publicId: string;

  @Field(() => [Int])
  roleIds: number[];
}

@InputType()
export class UpdateUserRequestDto extends OmitType(CreateUserRequestDto, [
  'password',
] as const) {
  @Field()
  publicId: string;
}

@InputType()
export class SearchUsersRequestDto {
  @Field()
  @IsString()
  search!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  limit?: number;
}

// phone.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function IsPhoneNumberValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneNumberValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const phoneNumber = parsePhoneNumberFromString(value);
          return !!phoneNumber && phoneNumber.isValid();
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid phone number format';
        },
      },
    });
  };
}

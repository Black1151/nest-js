// phone.transformer.ts
import { Transform } from 'class-transformer';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

/**
 * TransformPhoneNumber(countryField) looks up the user's selected country from the DTO,
 * uses it to parse local phone numbers, then outputs an E.164 phone string.
 *
 * @param countryField The field name on the DTO that holds an ISO-2 country code (e.g. "GB", "US", etc.).
 *                     Defaults to 'country'.
 */
export function TransformPhoneNumber(countryField: string = 'country') {
  return Transform(({ obj, value }) => {
    if (!value) {
      return value;
    }
    const iso2 = obj?.[countryField] as CountryCode | undefined;
    const phoneNumber = iso2
      ? parsePhoneNumberFromString(value, iso2)
      : parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return value;
    }
    return phoneNumber.format('E.164');
  });
}

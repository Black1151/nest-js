// db-error-overrides.decorator.ts
import { Extensions } from '@nestjs/graphql';
// import { PG_ERROR_NAME_MAP } from '../pg-error-names-map';

export interface DbErrorOverrideFriendly {
  codeName: keyof typeof PG_ERROR_NAME_MAP; // e.g. 'unique_violation'
  message: string;
}

export const PG_ERROR_NAME_MAP: Record<string, string> = {
  unique_violation: '23505',
  foreign_key_violation: '23503',
  not_null_violation: '23502',
  check_violation: '23514',
  numeric_value_out_of_range: '22003',
  invalid_text_representation: '22P02',
  undefined_column: '42703',
  undefined_table: '42P01',
  duplicate_column: '42701',
  duplicate_table: '42P07',
};

export function UiErrorMessageOverride(overrides: DbErrorOverrideFriendly[]) {
  return Extensions({ dbErrorOverrides: overrides });
}

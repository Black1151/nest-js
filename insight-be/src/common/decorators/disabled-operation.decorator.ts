import { SetMetadata } from '@nestjs/common';

export const IS_DISABLED_OPERATION_KEY = 'IS_DISABLED_OPERATION';

export function DisabledOperation() {
  return SetMetadata(IS_DISABLED_OPERATION_KEY, true);
}


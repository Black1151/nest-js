// src/common/decorators/immutable-logging-if.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ImmutableLogging } from '../../modules/audit/decorators/immutable-logging.decorator';

export function ImmutableLoggingIf(condition: boolean) {
  return applyDecorators(...(condition ? [ImmutableLogging()] : []));
}

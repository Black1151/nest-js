import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark a GraphQL operation as immutable.
 * This means that the operation will not be logged to the audit log.
 */

export const IMMUTABLE_LOGGING_KEY = 'IMMUTABLE_LOGGING';

export const ImmutableLogging = () => SetMetadata(IMMUTABLE_LOGGING_KEY, true);

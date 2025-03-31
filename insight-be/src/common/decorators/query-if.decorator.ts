// src/common/decorators/query-if.decorator.ts
import { Query } from '@nestjs/graphql';

/**
 * Usage:
 *
 * @QueryIf(condition, () => ReturnType, { name: 'myQuery' })
 * async myQuery(...) {...}
 *
 * If condition=false, it's a no-op => the method does NOT appear in the schema
 */
export function QueryIf(
  condition: boolean,
  ...queryArgs: Parameters<typeof Query>
) {
  if (condition) {
    return Query(...queryArgs);
  }

  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {};
}

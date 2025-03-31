// src/common/decorators/mutation-if.decorator.ts
import { Mutation } from '@nestjs/graphql';

/**
 * Usage:
 *
 * @MutationIf(condition, () => ReturnType, { name: 'myMutation' })
 * async myMutation(...) {...}
 *
 * If condition=false, it's a no-op => the method does NOT appear in the schema
 */
export function MutationIf(
  condition: boolean,
  ...mutationArgs: Parameters<typeof Mutation>
) {
  if (condition) {
    return Mutation(...mutationArgs);
  }
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {};
}

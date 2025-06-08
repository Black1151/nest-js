// src/common/decorators/mutation-if.decorator.ts
import { Mutation } from '@nestjs/graphql';
import { SetMetadata } from '@nestjs/common';
import { IS_DISABLED_OPERATION_KEY } from './disabled-operation.decorator';

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
  ) => {
    SetMetadata(IS_DISABLED_OPERATION_KEY, true)(
      target,
      propertyKey,
      descriptor,
    );
  };
}

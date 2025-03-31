// rbac-permission-key-if.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';

/**
 * Conditionally apply @RbacPermissionKey(stableKey).
 * If condition=false, it becomes a no-op.
 */
export function RbacPermissionKeyIf(condition: boolean, stableKey: string) {
  return applyDecorators(...(condition ? [RbacPermissionKey(stableKey)] : []));
}

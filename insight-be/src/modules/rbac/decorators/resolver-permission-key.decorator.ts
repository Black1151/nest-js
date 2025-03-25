import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY_METADATA = 'PERMISSION_KEY_METADATA';

export function RbacPermissionKey(stableKey: string) {
  return SetMetadata(PERMISSION_KEY_METADATA, stableKey);
}

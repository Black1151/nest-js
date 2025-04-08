// src/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE_KEY = 'IS_PUBLIC_ROUTE';
// export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export function PublicRoute() {
  return SetMetadata(IS_PUBLIC_ROUTE_KEY, true);
}

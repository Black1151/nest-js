import { BadRequestException } from '@nestjs/common';

export function validateStyleOverrides(
  content: any,
  allowedTokens: string[],
): void {
  const allowed = new Set(allowedTokens);

  function walk(val: any): void {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) {
      val.forEach(walk);
      return;
    }
    if (val.styleOverrides?.colorToken) {
      const tokenPath = val.styleOverrides.colorToken as string;
      const key = tokenPath.split('.').pop() as string;
      if (!allowed.has(key)) {
        throw new BadRequestException(
          `Style override token "${tokenPath}" is not permitted`,
        );
      }
    }
    Object.values(val).forEach(walk);
  }

  walk(content);
}

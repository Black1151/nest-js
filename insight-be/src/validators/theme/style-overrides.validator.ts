import { BadRequestException } from '@nestjs/common';

const DEFAULT_ALLOWED_FIELDS = [
  'colorToken',
  'fontSize',
  'fontFamily',
  'fontWeight',
  'lineHeight',
  'textAlign',
];

export function validateStyleOverrides(
  content: any,
  allowedTokens: string[],
  allowedFields: string[] = DEFAULT_ALLOWED_FIELDS,
): void {
  const allowed = new Set(allowedTokens);
  const allowedFieldsSet = new Set(allowedFields);

  function walk(val: any): void {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) {
      val.forEach(walk);
      return;
    }
    if (val.styleOverrides) {
      const overrides = val.styleOverrides as Record<string, any>;
      for (const key of Object.keys(overrides)) {
        if (!allowedFieldsSet.has(key)) {
          throw new BadRequestException(
            `Style override field "${key}" is not permitted`,
          );
        }
      }

      if (overrides.colorToken) {
        const tokenPath = overrides.colorToken as string;
        const tokenKey = tokenPath.split('.').pop() as string;
        if (!allowed.has(tokenKey)) {
          throw new BadRequestException(
            `Style override token "${tokenPath}" is not permitted`,
          );
        }
      }
    }
    Object.values(val).forEach(walk);
  }

  walk(content);
}

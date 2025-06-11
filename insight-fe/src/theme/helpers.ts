export interface ComponentVariant {
  id: number;
  baseComponent: string;
  /** Human readable name for screen readers */
  accessibleName?: string;
  props: Record<string, any>;
}

export interface ColorPalette {
  id: number;
  name: string;
  colors: string[];
}

export function resolveVariant(
  variants: ComponentVariant[] | undefined,
  variantId?: number,
): ComponentVariant | undefined {
  if (!variants || typeof variantId === 'undefined') return undefined;
  return variants.find((v) => Number(v.id) === Number(variantId));
}

export function paletteColor(
  palette: ColorPalette | undefined,
  index: number,
): string | undefined {
  if (!palette) return undefined;
  return palette.colors[index];
}

export type SemanticTokens = Record<string, Record<string, string>>;

export type ThemeTokens =
  | SemanticTokens
  | {
      semanticTokens?: SemanticTokens;
      foundationTokens?: { colors?: Record<string, any> };
      colors?: Record<string, any>;
    };

function resolvePath(obj: any, path: string): any {
  if (!obj) return undefined;
  const parts = path.split('.');
  let cur: any = obj;
  for (let i = 0; i < parts.length; i++) {
    if (cur == null) return undefined;
    if (Object.prototype.hasOwnProperty.call(cur, parts[i])) {
      cur = cur[parts[i]];
    } else {
      const remaining = parts.slice(i).join('.');
      if (Object.prototype.hasOwnProperty.call(cur, remaining)) {
        return cur[remaining];
      }
      return undefined;
    }
  }
  return cur;
}

export function tokenColor(tokens: ThemeTokens | undefined, path: string | undefined): string | undefined {
  if (!tokens || !path) return undefined;

  const semRoot = 'semanticTokens' in tokens ? tokens.semanticTokens : tokens;
  const semValue = resolvePath(semRoot, path);
  if (typeof semValue !== 'string') return undefined;
  if (semValue.startsWith('#')) return semValue;

  const foundationPath = semValue.startsWith('colors.') ? semValue.slice(7) : semValue;
  const foundationRoot =
    ('colors' in tokens ? (tokens as any).colors : undefined) ??
    (tokens as any).foundationTokens?.colors;
  const color = resolvePath(foundationRoot, foundationPath);
  return typeof color === 'string' ? color : semValue;
}

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
  colors: { name: string; value: string }[];
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
  return palette.colors[index]?.value;
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

export function tokenColor(
  tokens: ThemeTokens | undefined,
  path: string | undefined,
): string | undefined {
  if (!tokens || !path) return undefined;

  if (path.startsWith('#')) return path;

  const semRoot = 'semanticTokens' in tokens ? tokens.semanticTokens : tokens;
  const trySemantic =
    resolvePath(semRoot, path) ??
    resolvePath(semRoot, path.startsWith('colors.') ? path.slice(7) : `colors.${path}`);

  const foundationRoot =
    ('colors' in tokens ? (tokens as any).colors : undefined) ??
    (tokens as any).foundationTokens?.colors;

  if (typeof trySemantic === 'string') {
    if (trySemantic.startsWith('#')) return trySemantic;

    const foundationPath = trySemantic.startsWith('colors.')
      ? trySemantic.slice(7)
      : trySemantic;
    const color =
      resolvePath(foundationRoot, foundationPath) ??
      resolvePath(foundationRoot, `colors.${foundationPath}`);
    return typeof color === 'string' ? color : trySemantic;
  }

  const foundationPath = path.startsWith('colors.') ? path.slice(7) : path;
  const color =
    resolvePath(foundationRoot, foundationPath) ??
    resolvePath(foundationRoot, `colors.${foundationPath}`);
  return typeof color === 'string' ? color : undefined;
}

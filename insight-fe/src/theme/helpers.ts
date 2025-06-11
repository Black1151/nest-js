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

export function tokenColor(
  tokens: SemanticTokens | undefined,
  path: string | undefined,
): string | undefined {
  if (!tokens || !path) return undefined;
  const [category, key] = path.split(".");
  return tokens[category]?.[key];
}

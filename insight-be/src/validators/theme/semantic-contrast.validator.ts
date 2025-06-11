import { BadRequestException } from '@nestjs/common';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const srgb = v / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1: string, hex2: string): number {
  const L1 = luminance(hexToRgb(hex1));
  const L2 = luminance(hexToRgb(hex2));
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

export function validateSemanticTokenContrast(
  foundation: Record<string, any>,
  semantic: Record<string, any>,
): void {
  const background = foundation?.colors?.background;
  if (!background || !semantic?.colors) return;
  for (const [token, ref] of Object.entries(semantic.colors)) {
    if (typeof ref !== 'string') continue;
    const key = ref.replace('colors.', '');
    const color = foundation.colors?.[key];
    if (!color) continue;
    const ratio = contrast(color, background);
    if (ratio < 4.5) {
      throw new BadRequestException(
        `Semantic token "${token}" fails WCAG contrast ratio against background`,
      );
    }
  }
}

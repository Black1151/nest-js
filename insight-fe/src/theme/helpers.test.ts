import { tokenColor } from './helpers';

describe('tokenColor', () => {
  it('resolves semantic token to foundation color hex', () => {
    const theme = {
      semanticTokens: {
        colors: {
          brand: { primary: 'colors.blue.500' },
        },
      },
      colors: { blue: { '500': '#3182CE' } },
    };
    expect(tokenColor(theme as any, 'colors.brand.primary')).toBe('#3182CE');
  });
});

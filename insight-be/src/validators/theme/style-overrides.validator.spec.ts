import { BadRequestException } from '@nestjs/common';
import { validateStyleOverrides } from './style-overrides.validator';

describe('validateStyleOverrides', () => {
  const allowedTokens = ['primary', 'secondary'];

  it('allows valid overrides', () => {
    const content = {
      styleOverrides: { colorToken: 'colors.primary', fontSize: '16px' },
    };
    expect(() =>
      validateStyleOverrides(content, allowedTokens),
    ).not.toThrow();
  });

  it('rejects invalid token', () => {
    const content = {
      styleOverrides: { colorToken: 'colors.danger' },
    };
    expect(() => validateStyleOverrides(content, allowedTokens)).toThrow(
      BadRequestException,
    );
  });

  it('rejects unknown field', () => {
    const content = {
      styleOverrides: { colorToken: 'colors.primary', foo: 'bar' },
    };
    expect(() => validateStyleOverrides(content, allowedTokens)).toThrow(
      BadRequestException,
    );
  });

  it('validates nested objects', () => {
    const content = {
      slides: [
        {
          items: [{ styleOverrides: { colorToken: 'colors.secondary' } }],
        },
      ],
    };
    expect(() =>
      validateStyleOverrides(content, allowedTokens),
    ).not.toThrow();
  });
});

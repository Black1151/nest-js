# Theming Guide

This project uses a small design system built on top of Chakra UI.  Themes define design tokens that the Lesson Builder consumes when rendering content.  Each theme consists of two sets of tokens as well as optional component variants and color palettes.

## Foundation vs. Semantic Tokens

* **Foundation tokens** represent the raw building blocks such as color values.  They normally live under the `colors` key and store hex codes.  These tokens rarely change once defined.
* **Semantic tokens** reference foundation tokens by name.  They describe how colors are used (for example `colors.brand.primary`).  Semantic tokens make it easy to swap palettes while keeping component styles consistent.

The helper `tokenColor()` resolves semantic references to their underlying hex values.

## Component Variants

Component variants allow authors to define preconfigured props for common components.  A variant links a base component (for example `Button`) with a set of default props.  Variants can also have an `accessibleName` for screen readers.

When the Lesson Builder renders an element it looks up the variant by `variantId` and merges the stored props with the element's current configuration.

## Lesson Builder Themes and Palettes

Lessons reference a theme which in turn references a default color palette.  The Lesson Builder fetches the theme, palette and any component variants so that the editor can show the correct colors and options.

* **Themes** contain the token definitions and are versioned.  Upgrading a theme bumps the `version` field so lessons can opt in to newer design tokens.
* **Color palettes** are collections of color values that map to the foundation tokens.  By selecting a palette the same semantic tokens can produce a different visual style.

## Creating or Upgrading a Theme

1. Create your foundation and semantic token JSON objects.
2. Define any component variants your theme requires.
3. Choose a default color palette (or create a new one).
4. Use the `createTheme` mutation to store the theme with its `styleCollection` and palette.
5. When a new theme version is available call `upgradeLessonTheme` or `upgradeThemeVersion` to apply the latest tokens to existing lessons.


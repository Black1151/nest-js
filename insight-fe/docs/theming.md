# Theming Guide

This project uses a small design system built on top of Chakra UI. Themes define
design tokens that the Lesson Builder consumes when rendering content. Every
theme links to a **color palette** which supplies its foundation tokens and may
include component variants.

## Foundation vs. Semantic Tokens

* **Foundation tokens** represent the raw building blocks such as color values.
  They live under the `colors` key and are generated from the palette attached
  to the theme. Each entry in the palette becomes a foundation token keyed by its
  `name`.
* **Semantic tokens** reference foundation tokens by name. They map concepts like
  `colors.brand.primary` to a specific foundation token such as `colors.brand`.
  Because only the token name is stored, selecting a new palette instantly
  updates every semantic reference without touching component styles.

For example a semantic token might map a usage like `colors.brand.primary` to a
palette color named `brand`:

```json
{
  "semanticTokens": {
    "colors": {
      "brand": {
        "primary": "colors.brand"
      }
    }
  }
}
```

The helper `tokenColor()` resolves semantic references to their underlying hex values.

## Component Variants

Component variants allow authors to define preconfigured props for common
components. A variant links a base component (for example `Button`) with a set
of default props and can include an optional `accessibleName` for screen
readers. Variants are typically created directly from the canvas by enabling
**Save as Variant** when saving a styled element.

When the Lesson Builder renders an element it looks up the variant by `variantId` and merges the stored props with the element's current configuration.

## Lesson Builder Themes and Palettes

Lessons reference a theme which in turn references a default color palette.  The Lesson Builder fetches the theme, palette and any component variants so that the editor can show the correct colors and options.

* **Themes** contain the token definitions and are versioned.  Upgrading a theme bumps the `version` field so lessons can opt in to newer design tokens.
* **Color palettes** store named color values. Each entry has a `name` and a
  `value` (a hex code). When a palette is attached to a theme these names become
  the foundation tokens under `colors`, so selecting a different palette
  instantly updates every semantic reference.

```json
{
  "id": 1,
  "name": "Default",
  "colors": [
    { "name": "brand", "value": "#3182CE" },
    { "name": "accent", "value": "#DD6B20" }
  ]
}
```

When used by a theme these palette values become foundation tokens:

```json
{
  "foundationTokens": {
    "colors": {
      "brand": "#3182CE",
      "accent": "#DD6B20"
    }
  }
}
```

A theme stores these tokens alongside an identifier for its default palette:

```json
{
  "id": 3,
  "name": "My Theme",
  "defaultPaletteId": 1,
  "foundationTokens": {
    "colors": {
      "brand": "#3182CE",
      "accent": "#DD6B20"
    }
  },
  "semanticTokens": { /* ... */ }
}
```

## Creating or Upgrading a Theme

1. Create a **color palette** with your named hex values.
2. Build your **semantic token** map referencing those palette names (for example `colors.brand.primary` &rarr; `colors.brand`).
3. Define any **component variants** your theme requires. The easiest way is to
   design an element on the canvas and enable **Save as Variant** when saving the
   style.
4. Use the `createTheme` mutation to store the theme, supplying the palette id.  The palette colors become the foundation tokens automatically.
5. When a new theme version is available call `upgradeLessonTheme` or `upgradeThemeVersion` to apply the latest tokens to existing lessons.

## Creating Styled Elements in the Theme Builder

Styled elements let you reuse consistent formatting across lessons. The Theme
Builder provides an interface for defining these styles against your theme's
tokens.

1. **Drag an element onto the canvas** from the element list. Arrange or resize
   it however you like to preview how several items might look together.
2. With the element selected, **modify its attributes in the sidebar**. Use the
   attribute fields to apply design tokens&mdash;for example choose a semantic
   color token for text or background values.
3. Once you are satisfied, click **Save Element Style** and pick a **style
   group** in which to store the style.
4. Optionally enable **Save as Variant** to turn the element's current props
   into a reusable variant. This canvas-based flow is the primary way to create
   component variants.

Saving styles under a group ties them to your theme. When the theme's tokens are
updated, every lesson using a style from that group automatically receives the
new design. If you saved the element as a variant it will also appear in the
variant picker when adding new components. The canvas is for experimentation
only&mdash;the Theme Builder does not save complete slide layouts.


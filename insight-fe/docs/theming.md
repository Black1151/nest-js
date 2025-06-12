# Theming Guide

This project uses a small design system built on top of Chakra UI.  Themes define design tokens that the Lesson Builder consumes when rendering content.  Each theme links to a color palette which supplies its foundation tokens and may include component variants.

## Foundation vs. Semantic Tokens

* **Foundation tokens** represent the raw building blocks such as color values.  They live under the `colors` key and are created from the palette associated with the theme.  Each palette color becomes a foundation token keyed by its name.
* **Semantic tokens** reference foundation tokens by name.  They describe how colors are used (for example `colors.brand.primary`).  Because the references are by name, swapping palettes automatically updates the colors without changing component styles.

The helper `tokenColor()` resolves semantic references to their underlying hex values.

## Component Variants

Component variants allow authors to define preconfigured props for common components.  A variant links a base component (for example `Button`) with a set of default props.  Variants can also have an `accessibleName` for screen readers.

When the Lesson Builder renders an element it looks up the variant by `variantId` and merges the stored props with the element's current configuration.

## Lesson Builder Themes and Palettes

Lessons reference a theme which in turn references a default color palette.  The Lesson Builder fetches the theme, palette and any component variants so that the editor can show the correct colors and options.

* **Themes** contain the token definitions and are versioned.  Upgrading a theme bumps the `version` field so lessons can opt in to newer design tokens.
* **Color palettes** are collections of named color values.  Each palette stores entries like `{ name: "brand", value: "#3182CE" }`.  When a palette is attached to a theme these names become the foundation tokens under `colors`, so selecting a different palette instantly updates every semantic reference.

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

## Creating or Upgrading a Theme

1. Create a **color palette** with your named hex values.
2. Build your **semantic token** map referencing those palette names (for example `colors.brand.primary` &rarr; `colors.brand`).
3. Define any **component variants** your theme requires.
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
4. Optionally enable **Save as Variant** to create a component variant from the element's current props.

Saving styles under a group ties them to your theme. When the theme's tokens are
updated, every lesson using a style from that group automatically receives the
new design. If you saved the element as a variant it will also appear in the
variant picker when adding new components. The canvas is for experimentation
only&mdash;the Theme Builder does not save complete slide layouts.


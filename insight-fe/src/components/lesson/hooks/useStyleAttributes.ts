"use client";

import { useEffect, useState, type DependencyList } from "react";
import type { ElementWrapperStyles } from "../elements/ElementWrapper";

export interface StyleAttributesChange {
  wrapperStyles: ElementWrapperStyles;
  spacing?: number;
}

interface UseStyleAttributesOptions {
  wrapperStyles?: ElementWrapperStyles;
  spacing?: number;
  deps: DependencyList;
  onChange?: (values: StyleAttributesChange) => void;
  /** Default opacity when wrapperStyles doesn't provide one */
  defaultBgOpacity?: number;
}

export default function useStyleAttributes({
  wrapperStyles,
  spacing: initialSpacing,
  deps,
  onChange,
  defaultBgOpacity = 0,
}: UseStyleAttributesOptions) {
  const [bgColor, setBgColor] = useState(
    wrapperStyles?.bgColor || "surface.card"
  );
  const [bgOpacity, setBgOpacity] = useState(
    wrapperStyles?.bgOpacity ?? defaultBgOpacity
  );
  const [gradientFrom, setGradientFrom] = useState(
    wrapperStyles?.gradientFrom || ""
  );
  const [gradientTo, setGradientTo] = useState(wrapperStyles?.gradientTo || "");
  const [gradientDirection, setGradientDirection] = useState(
    wrapperStyles?.gradientDirection ?? 0
  );
  const [backgroundType, setBackgroundType] = useState(
    wrapperStyles?.gradientFrom && wrapperStyles?.gradientTo
      ? "gradient"
      : "color"
  );
  const [shadow, setShadow] = useState(wrapperStyles?.dropShadow || "none");
  const [paddingX, setPaddingX] = useState(wrapperStyles?.paddingX ?? 0);
  const [paddingY, setPaddingY] = useState(wrapperStyles?.paddingY ?? 0);
  const [marginX, setMarginX] = useState(wrapperStyles?.marginX ?? 0);
  const [marginY, setMarginY] = useState(wrapperStyles?.marginY ?? 0);
  const [borderColor, setBorderColor] = useState(
    wrapperStyles?.borderColor || "border.default"
  );
  const [borderWidth, setBorderWidth] = useState(
    wrapperStyles?.borderWidth ?? 0
  );
  const [borderRadius, setBorderRadius] = useState(
    wrapperStyles?.borderRadius || "none"
  );
  const [spacing, setSpacing] = useState<number | undefined>(initialSpacing);

  // Reset when dependencies change (new item selected)
  useEffect(() => {
    setBgColor(wrapperStyles?.bgColor || "surface.card");
    setBgOpacity(wrapperStyles?.bgOpacity ?? defaultBgOpacity);
    setGradientFrom(wrapperStyles?.gradientFrom || "");
    setGradientTo(wrapperStyles?.gradientTo || "");
    setGradientDirection(wrapperStyles?.gradientDirection ?? 0);
    setBackgroundType(
      wrapperStyles?.gradientFrom && wrapperStyles?.gradientTo
        ? "gradient"
        : "color"
    );
    setShadow(wrapperStyles?.dropShadow || "none");
    setPaddingX(wrapperStyles?.paddingX ?? 0);
    setPaddingY(wrapperStyles?.paddingY ?? 0);
    setMarginX(wrapperStyles?.marginX ?? 0);
    setMarginY(wrapperStyles?.marginY ?? 0);
    setBorderColor(wrapperStyles?.borderColor || "border.default");
    setBorderWidth(wrapperStyles?.borderWidth ?? 0);
    setBorderRadius(wrapperStyles?.borderRadius || "none");
    setSpacing(initialSpacing);
  }, deps);

  // Propagate changes upwards
  useEffect(() => {
    if (!onChange) return;
    const values: StyleAttributesChange = {
      wrapperStyles: {
        bgColor,
        bgOpacity,
        gradientFrom,
        gradientTo,
        gradientDirection,
        dropShadow: shadow,
        paddingX,
        paddingY,
        marginX,
        marginY,
        borderColor,
        borderWidth,
        borderRadius,
      },
    };
    if (typeof initialSpacing !== "undefined") {
      values.spacing = spacing;
    }
    onChange(values);
  }, [
    bgColor,
    bgOpacity,
    gradientFrom,
    gradientTo,
    gradientDirection,
    shadow,
    paddingX,
    paddingY,
    marginX,
    marginY,
    borderColor,
    borderWidth,
    borderRadius,
    spacing,
    backgroundType,
  ]);

  return {
    bgColor,
    setBgColor,
    bgOpacity,
    setBgOpacity,
    gradientFrom,
    setGradientFrom,
    gradientTo,
    setGradientTo,
    gradientDirection,
    setGradientDirection,
    backgroundType,
    setBackgroundType,
    shadow,
    setShadow,
    paddingX,
    setPaddingX,
    paddingY,
    setPaddingY,
    marginX,
    setMarginX,
    marginY,
    setMarginY,
    borderColor,
    setBorderColor,
    borderWidth,
    setBorderWidth,
    borderRadius,
    setBorderRadius,
    spacing,
    setSpacing,
  };
}

import type { ElementWrapperStyles } from "./elements/ElementWrapper";

export const defaultColumnWrapperStyles: ElementWrapperStyles = {
  bgColor: "#ffffff",
  bgOpacity: 0,
  gradientFrom: "",
  gradientTo: "",
  gradientDirection: 0,
  dropShadow: "none",
  paddingX: 0,
  paddingY: 0,
  marginX: 0,
  marginY: 0,
  borderColor: "#000000",
  borderWidth: 0,
  borderRadius: "none",
};

export const defaultBoardWrapperStyles: ElementWrapperStyles = {
  ...defaultColumnWrapperStyles,
  bgOpacity: 1,
};

export const defaultSlideWrapperStyles: ElementWrapperStyles = {
  ...defaultColumnWrapperStyles,
  bgOpacity: 1,
};

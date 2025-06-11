import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

export interface ElementWrapperStyles {
  bgColor?: string;
  /** Opacity value between 0 and 1 */
  bgOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: number;
  dropShadow?: string;
  paddingX?: number;
  paddingY?: number;
  marginX?: number;
  marginY?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: string | number;
}

interface ElementWrapperProps extends BoxProps {
  styles?: ElementWrapperStyles;
  children: React.ReactNode;
}

export default function ElementWrapper({ styles, children, ...props }: ElementWrapperProps) {
  const hexToRgba = (hex: string, opacity: number) => {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const background = styles?.gradientFrom && styles?.gradientTo
    ? `linear-gradient(${styles.gradientDirection ?? 0}deg, ${styles.gradientFrom}, ${styles.gradientTo})`
    : styles?.bgColor
    ? styles.bgColor.startsWith('#')
      ? hexToRgba(styles.bgColor, styles.bgOpacity ?? 0)
      : `rgba(var(--chakra-colors-${styles.bgColor.replace(/\./g, '-')}), ${
          styles.bgOpacity ?? 0
        })`
    : undefined;

  return (
    <Box
      bg={background}
      boxShadow={styles?.dropShadow}
      px={styles?.paddingX}
      py={styles?.paddingY}
      mx={styles?.marginX}
      my={styles?.marginY}
      borderColor={styles?.borderColor}
      borderWidth={styles?.borderWidth}
      borderRadius={styles?.borderRadius}
      overflow="hidden"
      borderStyle="solid"
      {...props}
    >
      {children}
    </Box>
  );
}

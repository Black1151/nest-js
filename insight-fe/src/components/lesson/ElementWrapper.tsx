import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

export interface ElementWrapperStyles {
  bgColor?: string;
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
  return (
    <Box
      bg={styles?.bgColor || "white"}
      boxShadow={styles?.dropShadow}
      px={styles?.paddingX}
      py={styles?.paddingY}
      mx={styles?.marginX}
      my={styles?.marginY}
      borderColor={styles?.borderColor}
      borderWidth={styles?.borderWidth}
      borderRadius={styles?.borderRadius}
      borderStyle="solid"
      {...props}
    >
      {children}
    </Box>
  );
}

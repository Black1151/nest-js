"use client";

import React from "react";
import { Box, Text, BoxProps } from "@chakra-ui/react";

interface SidebarProps extends BoxProps {}

export function Sidebar({ children, ...rest }: SidebarProps) {
  return (
    <Box bg="gray.100" overflowY="auto" {...rest}>
      <Text>Sidebar</Text>
      {children}
    </Box>
  );
}

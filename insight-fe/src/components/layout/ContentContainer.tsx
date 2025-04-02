import { Box } from "@chakra-ui/react";
import React from "react";

interface ContentContainerProps {
  children: React.ReactNode;
}

export const ContentContainer = ({ children }: ContentContainerProps) => {
  return (
    <Box flex="1" p={4} overflowY="auto" bg="gray.200">
      {children}
    </Box>
  );
};

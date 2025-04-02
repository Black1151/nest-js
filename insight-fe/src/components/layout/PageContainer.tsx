import { VStack } from "@chakra-ui/react";
import React from "react";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <VStack spacing={0} height="100vh" width="100vw" overflow="hidden">
      {children}
    </VStack>
  );
};

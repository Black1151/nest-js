"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

interface Props {
  children: ReactNode;
}

const TopLevelProviders: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </AuthProvider>
  );
};

export default TopLevelProviders;

"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalErrorListener } from "@/components/error/GlobalErrorListener";

interface Props {
  children: ReactNode;
}

const TopLevelProviders: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <GlobalErrorListener>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </GlobalErrorListener>
    </AuthProvider>
  );
};

export default TopLevelProviders;

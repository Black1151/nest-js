"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

interface Props {
  children: ReactNode;
}

const TopLevelProviders: React.FC<Props> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default TopLevelProviders;

"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const TopLevelProviders: React.FC<Props> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ApolloProvider>
  );
};

export default TopLevelProviders;

"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalErrorListener } from "@/components/error/GlobalErrorListener";
import { UserPayload } from "@/app/layout";

import { ApolloProvider } from "@apollo/client";
import client from "@/apollo/apollo-client";

interface Props {
  children: ReactNode;
  user: UserPayload | null;
}

const TopLevelProviders: React.FC<Props> = ({ children, user }) => {
  return (
    <AuthProvider user={user}>
      <GlobalErrorListener>
        <ApolloProvider client={client}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </ApolloProvider>
      </GlobalErrorListener>
    </AuthProvider>
  );
};

export default TopLevelProviders;

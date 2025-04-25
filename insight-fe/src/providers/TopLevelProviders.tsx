"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalErrorListener } from "@/components/error/GlobalErrorListener";
import { UserPayload } from "@/app/layout";
import { UserProvider } from "./UserProvider";

interface Props {
  children: ReactNode;
  user: UserPayload | null;
}

const TopLevelProviders: React.FC<Props> = ({ children, user }) => {
  return (
    <AuthProvider user={user}>
      <GlobalErrorListener>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </GlobalErrorListener>
    </AuthProvider>
  );
};

export default TopLevelProviders;

// GlobalErrorListener.tsx
import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { errorEmitter, GRAPHQL_ERROR_EVENT } from "./errorEmitter";
import type { GraphQLError } from "graphql";

export function GlobalErrorListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useToast();

  useEffect(() => {
    const onGraphQLError = (error: GraphQLError) => {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    };

    errorEmitter.on(GRAPHQL_ERROR_EVENT, onGraphQLError);
    return () => {
      errorEmitter.off(GRAPHQL_ERROR_EVENT, onGraphQLError);
    };
  }, [toast]);

  return <>{children}</>;
}

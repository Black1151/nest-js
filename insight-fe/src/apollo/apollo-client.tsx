import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { ensureRefresh } from "@/refreshClient";

function isUnauthorized({ graphQLErrors, networkError }: any): boolean {
  const graphqlUnauth = Array.isArray(graphQLErrors)
    ? graphQLErrors.some(
        (err) =>
          err.extensions?.originalError?.statusCode === 401 ||
          err.extensions?.code === "UNAUTHENTICATED"
      )
    : false;

  const networkUnauth =
    networkError && "statusCode" in networkError && networkError.statusCode === 401;

  return graphqlUnauth || networkUnauth;
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (isUnauthorized({ graphQLErrors, networkError })) {
    const context = operation.getContext();
    if (context.__unauth_retry) {
      // Already retried once, give up
      return;
    }

    operation.setContext({ ...context, __unauth_retry: true });

    return new Observable((observer) => {
      ensureRefresh()
        .then(() => {
          forward(operation).subscribe({
            next: (result) => observer.next(result),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
});

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: from([errorLink as ApolloLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;

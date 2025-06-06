import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from "zen-observable-ts";
import { ensureRefresh } from "../refreshClient";

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

const refreshLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
  const isAuthError =
    (networkError as any)?.statusCode === 401 ||
    graphQLErrors?.some(({ extensions }) => extensions?.code === "UNAUTHENTICATED");

  if (isAuthError) {
    return new Observable(observer => {
      ensureRefresh()
        .then(() => {
          forward(operation).subscribe({
            next: value => observer.next(value),
            error: err => observer.error(err),
            complete: () => observer.complete(),
          });
        })
        .catch(err => observer.error(err));
    });
  }
});

const client = new ApolloClient({
  link: from([refreshLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;

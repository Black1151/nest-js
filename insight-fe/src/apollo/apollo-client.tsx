import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
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
    return ensureRefresh().then(() => forward(operation));
  }
});

const client = new ApolloClient({
  link: from([refreshLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;

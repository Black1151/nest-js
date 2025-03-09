import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

// We'll store the token(s) somewhere—could be localStorage or a global store
let accessToken: string | null = null;

// Create an HttpLink pointing to your NestJS GraphQL
const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql", // or whatever your Nest server URL
});

// Middleware to attach the Authorization header if we have an access token
const authLink = setContext((_, { headers }) => {
  if (accessToken) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  return { headers };
});

// Optional: handle errors—for example, if 401 from server, we might attempt a refresh
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    // If your NestJS server returns some distinct error for expired token,
    // you can catch it here and do a silent refresh or redirect to login
  }
);

// Construct the client
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

// Helper function to set the access token
export function setAccessToken(token: string) {
  accessToken = token;
}

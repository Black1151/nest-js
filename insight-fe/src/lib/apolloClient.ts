// import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";

// const httpLink = new HttpLink({
//   uri: "/api/graphql",
// });

// const errorLink = onError(({ networkError, graphQLErrors }) => {
//   if (
//     networkError &&
//     "statusCode" in networkError &&
//     networkError.statusCode === 401
//   ) {
//     window.location.href = "/login";
//   } else if (graphQLErrors || networkError) {
//     window.location.href = "/error";
//   }
// });

// export const apolloClient = new ApolloClient({
//   link: errorLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

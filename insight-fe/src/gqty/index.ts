// gqlClient.ts
import { createReactClient } from "@gqty/react";
import { Cache, createClient, type QueryFetcher } from "gqty";
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from "./schema.generated";
import { ensureRefresh } from "@/refreshClient";
import { handleGraphQLErrors } from "@/components/error/gqlErrorHandler";

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions
) {
  let response = await fetch("/api/graphql", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables, operationName }),
    ...fetchOptions,
  });

  let parsedBody: any = null;
  let isUnauthorized = response.status === 401;

  if (!isUnauthorized) {
    const text = await response.text();
    try {
      parsedBody = JSON.parse(text);
    } catch (err) {
      throw new Error(
        `Invalid JSON response (status: ${response.status}): ${text}`
      );
    }

    if (
      Array.isArray(parsedBody?.errors) &&
      parsedBody.errors.some(
        (err: any) =>
          err.extensions?.originalError?.statusCode === 401 ||
          err.extensions?.code === "UNAUTHENTICATED"
      )
    ) {
      isUnauthorized = true;
    }
  }

  if (isUnauthorized) {
    try {
      await ensureRefresh();

      response = await fetch("/api/graphql", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables, operationName }),
        ...fetchOptions,
      });

      const text = await response.text();
      try {
        parsedBody = JSON.parse(text);
      } catch (err) {
        throw new Error(
          `Invalid JSON response after refresh (status: ${response.status}): ${text}`
        );
      }

      if (
        response.status === 401 ||
        (Array.isArray(parsedBody?.errors) &&
          parsedBody.errors.some(
            (err: any) =>
              err.extensions?.originalError?.statusCode === 401 ||
              err.extensions?.code === "UNAUTHENTICATED"
          ))
      ) {
        throw new Error("Unauthorized (even after refresh)");
      }
    } catch (err) {
      throw err;
    }
  }

  // dev-time console log
  if (
    process.env.NODE_ENV === "development" &&
    Array.isArray(parsedBody?.errors) &&
    parsedBody.errors.length > 0
  ) {
    console.error(
      "[queryFetcher] GraphQL Errors detected:",
      JSON.stringify(parsedBody.errors, null, 2)
    );
  }

  // Emit errors to frontend toast
  if (Array.isArray(parsedBody?.errors) && parsedBody.errors.length > 0) {
    handleGraphQLErrors(parsedBody.errors);
  }

  return parsedBody;
};

const cache = new Cache(undefined, {
  maxAge: 60 * 10000, // 10 minutes
  staleWhileRevalidate: 30 * 60 * 1000, // 30 minutes
  // normalization: true,
});

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
});

export const { resolve, subscribe, schema } = client;
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;
export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    suspense: true,
  },
});

export * from "./schema.generated";

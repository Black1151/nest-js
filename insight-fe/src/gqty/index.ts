/**
 * GQty: You can safely modify this file based on your needs.
 * This example assumes Next.js "app/api/graphql" is your proxy route.
 */
import { createReactClient } from "@gqty/react";
import { Cache, createClient, type QueryFetcher } from "gqty";
// import defaultResponseHandler only if you still want to use it later
// import { defaultResponseHandler } from "gqty";

import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from "./schema.generated";
import { ensureRefresh } from "@/refreshClient";

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions
) {
  // 1) First request
  let response = await fetch("/api/graphql", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables, operationName }),
    ...fetchOptions,
  });

  // Parse text manually so we can decide how to handle 401
  let parsedBody: any = null;
  let isUnauthorized = response.status === 401;

  if (!isUnauthorized) {
    const text = await response.text();
    try {
      parsedBody = JSON.parse(text);
    } catch (err) {
      // If JSON parse fails, it might be a server error or non-JSON response
      throw new Error(
        `Invalid JSON response (status: ${response.status}): ${text}`
      );
    }

    // Check for GraphQL-based UNAUTHENTICATED errors
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

  // 2) If unauthorized, attempt refresh and retry once
  if (isUnauthorized) {
    try {
      await ensureRefresh();

      // 2a) Retry the exact same request
      response = await fetch("/api/graphql", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables, operationName }),
        ...fetchOptions,
      });

      // 2b) parse the second response
      const text = await response.text();
      try {
        parsedBody = JSON.parse(text);
      } catch (err) {
        throw new Error(
          `Invalid JSON response after refresh (status: ${response.status}): ${text}`
        );
      }

      // If still 401 or an auth error, give up
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
      // Refresh failed or second call still returned 401
      throw err;
    }
  }

  // 3) If we made it here, either we weren’t unauthorized at all,
  //    or the refresh + retry succeeded. Return the final data.
  return parsedBody;
};

const cache = new Cache(undefined, {
  maxAge: 0,
  staleWhileRevalidate: 5 * 60 * 1000,
  normalization: true,
});

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
});

// Standard GQty exports
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

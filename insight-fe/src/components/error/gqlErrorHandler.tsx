// gqlErrorHandler.ts
import type { GraphQLError } from "graphql";
import { emitGraphQLError } from "./errorEmitter";

/**
 * Dispatch each GraphQL error via the global event emitter
 * so the front-end can display them in toasts (or elsewhere).
 */
export function handleGraphQLErrors(errors: GraphQLError[]) {
  errors.forEach((error) => {
    emitGraphQLError(error);
  });
}

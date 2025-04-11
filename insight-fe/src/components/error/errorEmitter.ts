// errorEmitter.ts
import { EventEmitter } from "events";

export const errorEmitter = new EventEmitter();
export const GRAPHQL_ERROR_EVENT = "graphQLError";

export function emitGraphQLError(error: any) {
  errorEmitter.emit(GRAPHQL_ERROR_EVENT, error);
}

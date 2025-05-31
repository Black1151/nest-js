import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

export const GET_STYLE_COLLECTIONS = typedGql("query")({
  getAllStyleCollection: [
    { data: { limit: 100 } },
    { id: true, name: true, description: true },
  ],
} as const);

export const CREATE_STYLE_COLLECTION = typedGql("mutation")({
  createStyleCollection: [
    { data: $("data", "CreateStyleCollectionInput!") },
    { id: true, name: true },
  ],
} as const);

export const CREATE_ELEMENT_STYLE = typedGql("mutation")({
  createElementStyle: [
    { data: $("data", "CreateElementStyleInput!") },
    { id: true, name: true },
  ],
} as const);

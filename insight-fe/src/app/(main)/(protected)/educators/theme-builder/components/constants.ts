export const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "row", label: "Row" },
  { type: "column", label: "Column" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "quiz", label: "Quiz" },
] as const;

export type AvailableElementType = typeof AVAILABLE_ELEMENTS[number]["type"];

export const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  row: "Row",
  column: "Column",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};



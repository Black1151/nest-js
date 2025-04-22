import { SystemStyleObject } from "@chakra-ui/react";

export type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

export const idleState: State = { type: "idle" };
export const draggingState: State = { type: "dragging" };

export const getStateStyle = (state: State["type"]) => {
  switch (state) {
    case "idle":
      return {
        cursor: "grab",
        boxShadow: "md",
        opacity: 1,
      };
    case "dragging":
      return {
        opacity: 0.4,
        boxShadow: "md",
      };
    case "preview":
      return {};
    default:
      return {};
  }
};

export interface BaseCardDnD {
  id: string;
}

export type ColumnType<TCard extends BaseCardDnD> = {
  title: string;
  columnId: string;
  items: TCard[];
  styles?: ColumnStyles;
  sortBy?: (item: TCard) => string;
  sortDirection?: "asc" | "desc" | "none";
};

export type ColumnStyles = {
  container?: SystemStyleObject;
  header?: SystemStyleObject;
  cardList?: SystemStyleObject;
  card?: SystemStyleObject;
};

export type ColumnMap<TCard extends BaseCardDnD> = {
  [columnId: string]: ColumnType<TCard>;
};

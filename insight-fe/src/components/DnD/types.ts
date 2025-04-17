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
      // No shadow for preview, the browser drag image handles that.
      return {};
    default:
      return {};
  }
};

// board-types.ts (or types.ts)
export interface BaseCardDnD {
  id: string;
}

export type ColumnType<TCard extends BaseCardDnD> = {
  title: string;
  columnId: string;
  items: TCard[];
  styles?: ColumnStyles;
};

export type ColumnStyles = {
  /** Applied to the outer <Flex> that wraps the whole column */
  container?: SystemStyleObject;
  /** Only the header row */
  header?: SystemStyleObject;
  /** The <Stack> that holds the cards */
  cardList?: SystemStyleObject;
  card?: SystemStyleObject;
};

export type ColumnMap<TCard extends BaseCardDnD> = {
  [columnId: string]: ColumnType<TCard>;
};

export const COLUMN_COLORS = [
  "red.300",
  "green.300",
  "blue.300",
  "orange.300",
  "purple.300",
  "teal.300",
];

export interface WrapperStyles {
  bgColor: string;
  bgOpacity: number;
  dropShadow: string;
  paddingX: number;
  paddingY: number;
  marginX: number;
  marginY: number;
  borderColor: string;
  borderWidth: number;
  borderRadius: string;
}

export const COLUMN_WRAPPER_DEFAULTS: WrapperStyles = {
  bgColor: "#ffffff",
  bgOpacity: 0,
  dropShadow: "none",
  paddingX: 0,
  paddingY: 0,
  marginX: 0,
  marginY: 0,
  borderColor: "#000000",
  borderWidth: 0,
  borderRadius: "none",
};

export const BOARD_WRAPPER_DEFAULTS: WrapperStyles = {
  ...COLUMN_WRAPPER_DEFAULTS,
  bgOpacity: 1,
};

export interface SlideBoard {
  id: string;
  orderedColumnIds: string[];
  wrapperStyles?: WrapperStyles;
}

import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

export function createDefaultColumn(color: string, columnId = `col-${crypto.randomUUID()}`): ColumnType<SlideElementDnDItemProps> {
  return {
    title: "",
    columnId,
    styles: {
      container: { border: "1px dashed gray", width: "100%" },
      header: { bg: color, color: "white", px: 2, py: 1 },
    },
    wrapperStyles: { ...COLUMN_WRAPPER_DEFAULTS },
    items: [],
    spacing: 0,
  };
}

export function createDefaultBoard(columnId: string, boardId = crypto.randomUUID()): SlideBoard {
  return {
    id: boardId,
    orderedColumnIds: [columnId],
    wrapperStyles: { ...BOARD_WRAPPER_DEFAULTS },
  };
}

export function createInitialBoard(): { columnMap: Record<string, ColumnType<SlideElementDnDItemProps>>; boards: SlideBoard[] } {
  const color = COLUMN_COLORS[0];
  const columnId = `col-${crypto.randomUUID()}`;
  const column = createDefaultColumn(color, columnId);
  const board = createDefaultBoard(columnId);
  return {
    columnMap: { [columnId]: column },
    boards: [board],
  };
}

"use client";

import { Button, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import SlideElementsBoard from "./SlideElementsBoard";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";

export interface BoardRow {
  id: string;
  orderedColumnIds: string[];
}

interface SlideElementsContainerProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: BoardRow[];
  onChange: (
    columnMap: ColumnMap<SlideElementDnDItemProps>,
    boards: BoardRow[],
  ) => void;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  dropIndicator?: { columnId: string; index: number } | null;
}

const COLUMN_COLORS = [
  "red.300",
  "green.300",
  "blue.300",
  "orange.300",
  "purple.300",
  "teal.300",
];

export default function SlideElementsContainer({
  columnMap,
  boards,
  onChange,
  selectedElementId,
  onSelectElement,
  dropIndicator,
}: SlideElementsContainerProps) {
  const instanceId = useRef(Symbol("slide-container"));
  const registry = useRef(createRegistry());

  const addBoard = () => {
    const colIdx = Object.keys(columnMap).length;
    const color = COLUMN_COLORS[colIdx % COLUMN_COLORS.length];
    const columnId = `col-${crypto.randomUUID()}`;
    const boardId = crypto.randomUUID();

    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: `Column 1`,
      columnId,
      styles: {
        container: { border: `2px dashed ${color}`, width: "100%" },
        header: { bg: color, color: "white" },
      },
      items: [],
    };

    onChange(
      { ...columnMap, [columnId]: newColumn },
      [...boards, { id: boardId, orderedColumnIds: [columnId] }],
    );
  };

  const updateBoard = (
    boardId: string,
    map: ColumnMap<SlideElementDnDItemProps>,
    ids: string[],
  ) => {
    onChange(
      map,
      boards.map((b) =>
        b.id === boardId ? { ...b, orderedColumnIds: ids } : b,
      ),
    );
  };

  return (
    <Stack gap={4}>
      <Button size="sm" colorScheme="teal" onClick={addBoard} alignSelf="flex-start">
        Add Container
      </Button>
      {boards.map((b) => (
        <SlideElementsBoard
          key={b.id}
          columnMap={columnMap}
          orderedColumnIds={b.orderedColumnIds}
          onChange={(map, ids) => updateBoard(b.id, map, ids)}
          registry={registry.current}
          instanceId={instanceId.current}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          dropIndicator={dropIndicator}
        />
      ))}
    </Stack>
  );
}

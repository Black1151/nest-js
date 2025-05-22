"use client";

import { Button, HStack } from "@chakra-ui/react";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";

interface SlideElementsBoardProps {
  board: BoardState<SlideElementDnDItemProps>;
  onChange: (board: BoardState<SlideElementDnDItemProps>) => void;
}

const COLUMN_COLORS = [
  "red.300",
  "green.300",
  "blue.300",
  "orange.300",
  "purple.300",
  "teal.300",
];

export default function SlideElementsBoard({ board, onChange }: SlideElementsBoardProps) {
  const addColumn = () => {
    const idx = board.orderedColumnIds.length;
    const color = COLUMN_COLORS[idx % COLUMN_COLORS.length];
    const id = `col-${Date.now()}`;
    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: `Column ${idx + 1}`,
      columnId: id,
      styles: {
        container: { border: `2px dashed ${color}`, width: "100%" },
        header: { bg: color, color: "white" },
      },
      items: [],
    };
    onChange({
      ...board,
      columnMap: { ...board.columnMap, [id]: newColumn },
      orderedColumnIds: [...board.orderedColumnIds, id],
    });
  };

  const removeColumn = (columnId: string) => {
    if (board.orderedColumnIds.length <= 1) return;
    const newMap = { ...board.columnMap };
    delete newMap[columnId];
    onChange({
      ...board,
      columnMap: newMap,
      orderedColumnIds: board.orderedColumnIds.filter((id) => id !== columnId),
    });
  };

  return (
    <>
      <HStack mb={2} justify="flex-end">
        <Button size="sm" colorScheme="teal" onClick={addColumn}>
          Add Column
        </Button>
      </HStack>
      <DnDBoardMain<SlideElementDnDItemProps>
        columnMap={board.columnMap}
        orderedColumnIds={board.orderedColumnIds}
        CardComponent={SlideElementDnDItem}
        enableColumnReorder={false}
        onChange={onChange}
        onRemoveColumn={removeColumn}
      />
    </>
  );
}

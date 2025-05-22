"use client";

import { useMemo } from "react";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";

interface SlideElementsBoardProps {
  elements: SlideElementDnDItemProps[];
  onChange: (elements: SlideElementDnDItemProps[]) => void;
}

export default function SlideElementsBoard({
  elements,
  onChange,
}: SlideElementsBoardProps) {
  const columnMap = useMemo<Record<string, ColumnType<SlideElementDnDItemProps>>>(
    () => ({
      elements: {
        title: "Elements",
        columnId: "elements",
        styles: {
          container: { border: "2px dashed gray", width: "100%" },
          header: { bg: "gray.200" },
        },
        items: elements,
      },
    }),
    [elements]
  );

  const orderedColumnIds = ["elements"];

  const handleChange = (board: BoardState<SlideElementDnDItemProps>) => {
    onChange(board.columnMap.elements.items as SlideElementDnDItemProps[]);
  };

  return (
    <DnDBoardMain<SlideElementDnDItemProps>
      columnMap={columnMap}
      orderedColumnIds={orderedColumnIds}
      CardComponent={SlideElementDnDItem}
      enableColumnReorder={false}
      onChange={handleChange}
    />
  );
}

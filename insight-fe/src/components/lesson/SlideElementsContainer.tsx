"use client";

import { Button, Stack } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import SlideElementsBoard from "./SlideElementsBoard";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";
import { ContentCard } from "../layout/Card";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

export interface BoardRow {
  id: string;
  orderedColumnIds: string[];
}

interface SlideElementsContainerProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: BoardRow[];
  onChange: (
    columnMap: ColumnMap<SlideElementDnDItemProps>,
    boards: BoardRow[]
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

    onChange({ ...columnMap, [columnId]: newColumn }, [
      ...boards,
      { id: boardId, orderedColumnIds: [columnId] },
    ]);
  };

  const updateBoard = (
    boardId: string,
    map: ColumnMap<SlideElementDnDItemProps>,
    ids: string[]
  ) => {
    onChange(
      map,
      boards.map((b) =>
        b.id === boardId ? { ...b, orderedColumnIds: ids } : b
      )
    );
  };

  // Handle moving columns between boards
  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.instanceId === instanceId.current,
      onDrop: ({ source, location }) => {
        if (source.data.type !== "column") return;
        if (!location.current.dropTargets.length) return;

        const columnId = source.data.columnId as string;

        const startBoardIdx = boards.findIndex((b) =>
          b.orderedColumnIds.includes(columnId)
        );
        if (startBoardIdx === -1) return;

        const target = location.current.dropTargets[0];
        const targetColumnId = target.data.columnId as string;
        const destBoardIdx = boards.findIndex((b) =>
          b.orderedColumnIds.includes(targetColumnId)
        );
        if (destBoardIdx === -1) return;

        if (startBoardIdx === destBoardIdx) {
          // same board - internal logic already handles
          return;
        }

        const indexOfTarget = boards[destBoardIdx].orderedColumnIds.findIndex(
          (id) => id === targetColumnId
        );
        const closestEdge: Edge | null = extractClosestEdge(target.data);
        const insertIndex =
          closestEdge === "right" ? indexOfTarget + 1 : indexOfTarget;

        const updatedBoards = boards.map((b, idx) => {
          if (idx === startBoardIdx) {
            return {
              ...b,
              orderedColumnIds: b.orderedColumnIds.filter((id) => id !== columnId),
            };
          }
          if (idx === destBoardIdx) {
            const ids = Array.from(b.orderedColumnIds);
            ids.splice(insertIndex, 0, columnId);
            return { ...b, orderedColumnIds: ids };
          }
          return b;
        });

        onChange(columnMap, updatedBoards);
      },
    });
  }, [boards, columnMap, onChange]);

  return (
    <Stack gap={4}>
      <Button
        size="sm"
        colorScheme="teal"
        onClick={addBoard}
        alignSelf="flex-start"
      >
        Add Container
      </Button>
      {boards.map((b) => (
        <ContentCard minHeight={400} key={b.id}>
          <SlideElementsBoard
            // key={b.id}
            columnMap={columnMap}
            orderedColumnIds={b.orderedColumnIds}
            onChange={(map, ids) => updateBoard(b.id, map, ids)}
            registry={registry.current}
            instanceId={instanceId.current}
            selectedElementId={selectedElementId}
            onSelectElement={onSelectElement}
            dropIndicator={dropIndicator}
          />
        </ContentCard>
      ))}
    </Stack>
  );
}

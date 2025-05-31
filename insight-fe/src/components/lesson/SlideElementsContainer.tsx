"use client";

import { Button, Stack, HStack } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import SlideElementsBoard from "./SlideElementsBoard";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";
import { ContentCard } from "../layout/Card";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

export interface BoardRow {
  id: string;
  orderedColumnIds: string[];
  /** Gap between columns in this container */
  spacing?: number;
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
  selectedColumnId?: string | null;
  onSelectColumn?: (id: string) => void;
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
  selectedColumnId,
  onSelectColumn,
}: SlideElementsContainerProps) {
  const instanceId = useRef(Symbol("slide-container"));
  const registry = useRef(createRegistry());
  const [boardIdToDelete, setBoardIdToDelete] = useState<string | null>(null);

  const addBoard = () => {
    const colIdx = Object.keys(columnMap).length;
    const color = COLUMN_COLORS[colIdx % COLUMN_COLORS.length];
    const columnId = `col-${crypto.randomUUID()}`;
    const boardId = crypto.randomUUID();

    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: "",
      columnId,
      styles: {
        container: { border: `2px dashed ${color}`, width: "100%" },
        header: { bg: color, color: "white" },
      },
      wrapperStyles: {
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
      },
      items: [],
    };

    onChange({ ...columnMap, [columnId]: newColumn }, [
      ...boards,
      { id: boardId, orderedColumnIds: [columnId], spacing: 2 },
    ]);
  };

  const updateBoard = (
    boardId: string,
    map: ColumnMap<SlideElementDnDItemProps>,
    ids: string[],
    spacing?: number
  ) => {
    onChange(
      map,
      boards.map((b) =>
        b.id === boardId ? { ...b, orderedColumnIds: ids, spacing } : b
      )
    );
  };

  const deleteBoard = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const newMap = { ...columnMap };
    for (const colId of board.orderedColumnIds) {
      delete newMap[colId];
    }
    onChange(
      newMap,
      boards.filter((b) => b.id !== boardId)
    );
  };

  const removeBoard = (boardId: string) => {
    if (boards.length <= 1) return;
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const hasContent = board.orderedColumnIds.some(
      (id) => columnMap[id]?.items.length > 0
    );
    if (hasContent) {
      setBoardIdToDelete(boardId);
      return;
    }
    deleteBoard(boardId);
  };

  const confirmRemoveBoard = () => {
    if (boardIdToDelete) {
      deleteBoard(boardIdToDelete);
      setBoardIdToDelete(null);
    }
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

        const updatedBoards = boards
          .map((b, idx) => {
            if (idx === startBoardIdx) {
              return {
                ...b,
                orderedColumnIds: b.orderedColumnIds.filter(
                  (id) => id !== columnId
                ),
              };
            }
            if (idx === destBoardIdx) {
              const ids = Array.from(b.orderedColumnIds);
              ids.splice(insertIndex, 0, columnId);
              return { ...b, orderedColumnIds: ids };
            }
            return b;
          })
          .filter((b) => b.orderedColumnIds.length > 0);

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
            columnMap={columnMap}
            orderedColumnIds={b.orderedColumnIds}
            onChange={(map, ids) => updateBoard(b.id, map, ids, b.spacing)}
            registry={registry.current}
            instanceId={instanceId.current}
            spacing={b.spacing}
            selectedElementId={selectedElementId}
            onSelectElement={onSelectElement}
            dropIndicator={dropIndicator}
            onRemoveBoard={() => removeBoard(b.id)}
            selectedColumnId={selectedColumnId}
            onSelectColumn={onSelectColumn}
            onSpacingChange={(val) => updateBoard(b.id, columnMap, b.orderedColumnIds, val)}
          />
        </ContentCard>
      ))}
      <ConfirmationModal
        isOpen={boardIdToDelete !== null}
        onClose={() => setBoardIdToDelete(null)}
        action="delete container"
        bodyText="This container has columns with content. Are you sure you want to delete it?"
        onConfirm={confirmRemoveBoard}
      />
    </Stack>
  );
}

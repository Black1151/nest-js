"use client";

import { Button, Stack, HStack } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import SlideElementsBoard from "./SlideElementsBoard";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";
import type { ElementWrapperStyles } from "./ElementWrapper";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import {
  monitorForElements,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

export interface BoardRow {
  id: string;
  orderedColumnIds: string[];
  wrapperStyles?: ElementWrapperStyles;
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
  selectedBoardId?: string | null;
  onSelectBoard?: (id: string) => void;
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
  selectedBoardId,
  onSelectBoard,
}: SlideElementsContainerProps) {
  const instanceId = useRef(Symbol("slide-container"));
  const boardInstanceId = useRef(Symbol("board-container"));
  const containerRef = useRef<HTMLDivElement | null>(null);
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
        container: { border: "1px dashed gray", width: "100%" },
        header: { bg: color, color: "white", px: 2, py: 1 },
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
      spacing: 0,
    };

    onChange({ ...columnMap, [columnId]: newColumn }, [
      ...boards,
      {
        id: boardId,
        orderedColumnIds: [columnId],
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
        spacing: 0,
      },
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

  useEffect(() => {
    if (!containerRef.current) return;
    return dropTargetForElements({
      element: containerRef.current,
      canDrop: ({ source }) =>
        source.data.instanceId === boardInstanceId.current &&
        source.data.type === "board",
      getData: () => ({ columnId: "boards" }),
      getIsSticky: () => true,
    });
  }, []);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) =>
        source.data.instanceId === boardInstanceId.current,
      onDrop: ({ source, location }) => {
        if (source.data.type !== "board") return;
        if (!location.current.dropTargets.length) return;

        const startIndex = boards.findIndex((b) => b.id === source.data.boardId);
        if (startIndex === -1) return;

        if (location.current.dropTargets.length === 1) {
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget: boards.length - 1,
            closestEdgeOfTarget: null,
            axis: "vertical",
          });
          const reordered = reorder({
            list: boards,
            startIndex,
            finishIndex: destinationIndex,
          });
          onChange(columnMap, reordered);
          return;
        }

        if (location.current.dropTargets.length === 2) {
          const [destinationRecord] = location.current.dropTargets;
          const indexOfTarget = boards.findIndex(
            (b) => b.id === destinationRecord.data.boardId,
          );
          const closestEdgeOfTarget = extractClosestEdge(destinationRecord.data);
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });
          const reordered = reorder({
            list: boards,
            startIndex,
            finishIndex: destinationIndex,
          });
          onChange(columnMap, reordered);
        }
      },
    });
  }, [boards, columnMap, onChange]);

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
    <Stack gap={4} ref={containerRef}>
      <Button
        size="sm"
        colorScheme="teal"
        onClick={addBoard}
        alignSelf="flex-start"
      >
        Add Container
      </Button>
      {boards.map((b) => (
        <SlideElementsBoard
          key={b.id}
          boardId={b.id}
          wrapperStyles={b.wrapperStyles}
          spacing={b.spacing}
          columnMap={columnMap}
          orderedColumnIds={b.orderedColumnIds}
          onChange={(map, ids) => updateBoard(b.id, map, ids)}
          registry={registry.current}
          instanceId={instanceId.current}
          boardInstanceId={boardInstanceId.current}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          dropIndicator={dropIndicator}
          onRemoveBoard={() => removeBoard(b.id)}
          selectedColumnId={selectedColumnId}
          onSelectColumn={onSelectColumn}
          isSelected={selectedBoardId === b.id}
          onSelectBoard={() => onSelectBoard?.(b.id)}
        />
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

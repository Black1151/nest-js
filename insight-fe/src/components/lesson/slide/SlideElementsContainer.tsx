"use client";

import { Button, Stack, HStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import SlideElementsBoard from "./SlideElementsBoard";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";

import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useContainerDragDrop } from "@/hooks/useContainerDragDrop";
import {
  defaultColumnWrapperStyles,
  defaultBoardWrapperStyles,
} from "../defaultStyles";
import { ElementWrapperStyles } from "../elements/ElementWrapper";

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
      },
      wrapperStyles: { ...defaultColumnWrapperStyles },
      items: [],
      spacing: 0,
    };

    onChange({ ...columnMap, [columnId]: newColumn }, [
      ...boards,
      {
        id: boardId,
        orderedColumnIds: [columnId],
        wrapperStyles: { ...defaultBoardWrapperStyles },
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

  useContainerDragDrop(
    containerRef,
    boards,
    columnMap,
    onChange,
    boardInstanceId,
    instanceId
  );

  return (
    <Stack ref={containerRef} spacing={0}>
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

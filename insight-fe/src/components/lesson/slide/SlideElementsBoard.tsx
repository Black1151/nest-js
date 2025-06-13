"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType, ColumnMap } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";

import { useCallback } from "react";
import { GripVertical } from "lucide-react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { useBoardDragDrop } from "@/hooks/useBoardDragDrop";
import { ContentCard } from "@/components/layout/Card";
import { defaultColumnWrapperStyles } from "../defaultStyles";
import ElementWrapper, {
  ElementWrapperStyles,
} from "../elements/ElementWrapper";

interface SlideElementsBoardProps {
  boardId: string;
  wrapperStyles?: ElementWrapperStyles;
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  orderedColumnIds: string[];
  onChange: (
    columnMap: ColumnMap<SlideElementDnDItemProps>,
    orderedIds: string[]
  ) => void;
  registry: ReturnType<typeof createRegistry>;
  instanceId: symbol;
  boardInstanceId: symbol;
  spacing?: number;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  dropIndicator?: { columnId: string; index: number } | null;
  onRemoveBoard?: () => void;
  selectedColumnId?: string | null;
  onSelectColumn?: (id: string) => void;
  isSelected?: boolean;
  onSelectBoard?: () => void;
}


export default function SlideElementsBoard({
  boardId,
  wrapperStyles,
  columnMap,
  orderedColumnIds,
  onChange,
  registry,
  instanceId,
  boardInstanceId,
  spacing = 0,
  selectedElementId,
  onSelectElement,
  dropIndicator,
  onRemoveBoard,
  selectedColumnId,
  onSelectColumn,
  isSelected,
  onSelectBoard,
}: SlideElementsBoardProps) {
  /* ------------------------------------------------------------------ */
  /*  Column helpers                                                     */
  /* ------------------------------------------------------------------ */
  const [columnIdToDelete, setColumnIdToDelete] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useBoardDragDrop(
    boardRef,
    dragHandleRef,
    boardId,
    boardInstanceId,
    setClosestEdge,
    setIsDragging
  );


  const deleteColumn = (columnId: string) => {
    if (orderedColumnIds.length <= 1) return;
    const newMap = { ...columnMap };
    delete newMap[columnId];
    onChange(
      newMap,
      orderedColumnIds.filter((id) => id !== columnId)
    );
  };

  const removeColumn = (columnId: string) => {
    if (columnMap[columnId]?.items.length) {
      setColumnIdToDelete(columnId);
      return;
    }
    deleteColumn(columnId);
  };

  const confirmRemoveColumn = () => {
    if (columnIdToDelete) {
      deleteColumn(columnIdToDelete);
      setColumnIdToDelete(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Card wrapper                                                       */
  /* ------------------------------------------------------------------ */
  // const CardWrapper = ({ item }: { item: SlideElementDnDItemProps }) => (
  //   <SlideElementDnDItem
  //     item={item}
  //     onSelect={() => onSelectElement?.(item.id)}
  //     isSelected={selectedElementId === item.id}
  //   />
  // );

  const CardWrapper = useCallback(
    ({ item }: { item: SlideElementDnDItemProps }) => (
      <SlideElementDnDItem
        item={item}
        onSelect={() => onSelectElement?.(item.id)}
        isSelected={selectedElementId === item.id}
      />
    ),
    [selectedElementId, onSelectElement]
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <Box ref={boardRef} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top={0}
        left={0}
        role="group"
        zIndex={1}
      >
        <IconButton
          ref={dragHandleRef}
          aria-label="Drag container"
          icon={<GripVertical size={12} />}
          size="xs"
          variant="ghost"
          cursor="grab"
          onClick={() => {
            if (isDragging) return;
            onSelectBoard?.();
          }}
        />
      </Box>
      <ElementWrapper
        styles={wrapperStyles}
        borderColor={isSelected ? "blue.300" : undefined}
        borderWidth={isSelected ? 2 : undefined}
        data-board-id={boardId}
      >
        <ContentCard bg="transparent" dropShadow="none" p={0}>
          <DnDBoardMain<SlideElementDnDItemProps>
            controlled
            columnMap={columnMap}
            orderedColumnIds={orderedColumnIds}
            CardComponent={CardWrapper}
            onChange={(b) => onChange(b.columnMap, b.orderedColumnIds)}
            onRemoveColumn={removeColumn}
            externalDropIndicator={dropIndicator}
            selectedColumnId={selectedColumnId}
            onSelectColumn={onSelectColumn}
            instanceId={instanceId}
            registry={registry}
            spacing={spacing}
          />
        </ContentCard>
      </ElementWrapper>
      <ConfirmationModal
        isOpen={columnIdToDelete !== null}
        onClose={() => setColumnIdToDelete(null)}
        action="delete column"
        bodyText="This column contains elements. Are you sure you want to delete it?"
        onConfirm={confirmRemoveColumn}
      />
      {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
    </Box>
  );
}

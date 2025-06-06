"use client";

import { Box, HStack, IconButton } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType, ColumnMap } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";

import { useCallback } from "react";
import { X, Settings, Plus, GripVertical } from "lucide-react";
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

const COLUMN_COLORS = [
  "red.300",
  "green.300",
  "blue.300",
  "orange.300",
  "purple.300",
  "teal.300",
];

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
  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useBoardDragDrop(
    boardRef,
    dragHandleRef,
    boardId,
    boardInstanceId,
    setClosestEdge
  );

  const addColumn = () => {
    const idx = orderedColumnIds.length;
    const color = COLUMN_COLORS[idx % COLUMN_COLORS.length];
    const id = `col-${crypto.randomUUID()}` as const;

    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: "",
      columnId: id,
      styles: {
        container: { border: "1px dashed gray", width: "100%" },
      },
      wrapperStyles: { ...defaultColumnWrapperStyles },
      items: [],
      spacing: 0,
    };

    onChange({ ...columnMap, [id]: newColumn }, [...orderedColumnIds, id]);
  };

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

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <Box ref={boardRef} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top={0}
        left={0}
        width={6}
        height={6}
        role="group"
        zIndex={1}
      >
        <Box
          opacity={0}
          transition="opacity 0.2s"
          pointerEvents="none"
          _groupHover={{ opacity: 1 }}
        >
          <GripVertical size={12} />
        </Box>
        <HStack
          ref={dragHandleRef}
          justify="flex-start"
          bg="gray.100"
          px={2}
          py={1}
          borderRadius="md"
          spacing={1}
          cursor="grab"
          position="absolute"
          top={0}
          left={0}
          transform="translateY(-100%)"
          transition="transform 0.2s"
          _groupHover={{ transform: "translateY(0)" }}
          _hover={{ transform: "translateY(0)" }}
          _active={{ transform: "translateY(0)" }}
        >
        {onRemoveBoard && (
          <IconButton
            aria-label="Delete container"
            icon={<X size={12} />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={onRemoveBoard}
          />
        )}
        <ContentCard pb={0} bg="transparent" dropShadow="none" p={0}>
          <IconButton
            aria-label="Edit container"
            icon={<Settings size={12} />}
            size="xs"
            variant="ghost"
            onClick={onSelectBoard}
          />
        )}
        <IconButton
          aria-label="Add column"
          icon={<Plus size={12} />}
          size="xs"
          variant="ghost"
          colorScheme="teal"
          onClick={addColumn}
        />
      </HStack>
      </Box>
      <ElementWrapper
        styles={wrapperStyles}
        borderColor={isSelected ? "blue.300" : undefined}
        borderWidth={isSelected ? 2 : undefined}
        data-board-id={boardId}
      >
        <ContentCard pb={25} bg="transparent" dropShadow="none" p={0}>
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

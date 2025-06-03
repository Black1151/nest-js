"use client";

import { Box, HStack, IconButton, Stack } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType, ColumnMap } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";
import { ContentCard } from "../layout/Card";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";
import { useCallback } from "react";
import { X, Settings, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

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

  useEffect(() => {
    if (!boardRef.current || !dragHandleRef.current) return;
    const el = boardRef.current;
    return combine(
      draggable({
        element: el,
        dragHandle: dragHandleRef.current,
        getInitialData: () => ({
          type: "board",
          boardId,
          instanceId: boardInstanceId,
        }),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) =>
          source.data.instanceId === boardInstanceId &&
          source.data.type === "board",
        getIsSticky: () => true,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { type: "board", boardId },
            { input, element, allowedEdges: ["top", "bottom"] }
          ),
        onDragEnter: (args) =>
          setClosestEdge(extractClosestEdge(args.self.data)),
        onDrag: (args) => setClosestEdge(extractClosestEdge(args.self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [boardInstanceId, boardId]);

  const addColumn = () => {
    const idx = orderedColumnIds.length;
    const color = COLUMN_COLORS[idx % COLUMN_COLORS.length];
    const id = `col-${crypto.randomUUID()}` as const;

    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: "",
      columnId: id,
      styles: {
        container: { border: "1px dashed gray", width: "100%" },
        header: { bg: color, color: "white", px: 2, py: 1 },
      },
      wrapperStyles: {
        bgColor: "#ffffff",
        bgOpacity: 0,
        gradientFrom: "",
        gradientTo: "",
        gradientDirection: 0,
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
    <Box ref={boardRef} position="relative">
      <HStack
        ref={dragHandleRef}
        justify="flex-end"
        bg="gray.100"
        px={2}
        py={1}
        borderRadius="md"
        spacing={1}
        cursor="grab"
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
        {onSelectBoard && (
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
      <ElementWrapper
        styles={wrapperStyles}
        borderColor={isSelected ? "blue.300" : undefined}
        borderWidth={isSelected ? 2 : undefined}
        data-board-id={boardId}
      >
        <ContentCard height={700} bg="transparent" dropShadow="none" p={0}>
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

"use client";

import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType, ColumnMap } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";
import { ContentCard } from "../layout/Card";
import { useCallback } from "react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface SlideElementsBoardProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  orderedColumnIds: string[];
  onChange: (
    columnMap: ColumnMap<SlideElementDnDItemProps>,
    orderedIds: string[],
  ) => void;
  registry: ReturnType<typeof createRegistry>;
  instanceId: symbol;
  spacing?: number;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  dropIndicator?: { columnId: string; index: number } | null;
  onRemoveBoard?: () => void;
  selectedColumnId?: string | null;
  onSelectColumn?: (id: string) => void;
  onSpacingChange?: (value: number) => void;
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
  columnMap,
  orderedColumnIds,
  onChange,
  registry,
  instanceId,
  spacing = 2,
  selectedElementId,
  onSelectElement,
  dropIndicator,
  onRemoveBoard,
  selectedColumnId,
  onSelectColumn,
  onSpacingChange,
}: SlideElementsBoardProps) {
  /* ------------------------------------------------------------------ */
  /*  Column helpers                                                     */
  /* ------------------------------------------------------------------ */
  const [columnIdToDelete, setColumnIdToDelete] = useState<string | null>(null);

  const addColumn = () => {
    const idx = orderedColumnIds.length;
    const color = COLUMN_COLORS[idx % COLUMN_COLORS.length];
    const id = `col-${crypto.randomUUID()}` as const;

    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: "",
      columnId: id,
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

    onChange(
      { ...columnMap, [id]: newColumn },
      [...orderedColumnIds, id],
    );
  };

  const deleteColumn = (columnId: string) => {
    if (orderedColumnIds.length <= 1) return;
    const newMap = { ...columnMap };
    delete newMap[columnId];
    onChange(
      newMap,
      orderedColumnIds.filter((id) => id !== columnId),
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
    <>
      <HStack mb={2} justify="space-between">
        {onRemoveBoard && (
          <Button size="sm" colorScheme="red" onClick={onRemoveBoard}>
            Delete Container
          </Button>
        )}
        <HStack>
          <Button size="sm" colorScheme="teal" onClick={addColumn}>
            Add Column
          </Button>
          {onSpacingChange && (
            <Input
              size="xs"
              type="number"
              width="60px"
              value={spacing}
              onChange={(e) => onSpacingChange(parseInt(e.target.value))}
            />
          )}
        </HStack>
      </HStack>

      <ContentCard height={700}>
        <DnDBoardMain<SlideElementDnDItemProps>
          controlled
          columnMap={columnMap}
          orderedColumnIds={orderedColumnIds}
          CardComponent={CardWrapper}
          columnSpacing={spacing}
          onChange={(b) => onChange(b.columnMap, b.orderedColumnIds)}
          onRemoveColumn={removeColumn}
          externalDropIndicator={dropIndicator}
          selectedColumnId={selectedColumnId}
          onSelectColumn={onSelectColumn}
          instanceId={instanceId}
          registry={registry}
        />
      </ContentCard>
      <ConfirmationModal
        isOpen={columnIdToDelete !== null}
        onClose={() => setColumnIdToDelete(null)}
        action="delete column"
        bodyText="This column contains elements. Are you sure you want to delete it?"
        onConfirm={confirmRemoveColumn}
      />
    </>
  );
}

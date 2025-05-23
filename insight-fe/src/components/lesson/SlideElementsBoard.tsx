"use client";

import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType, ColumnMap } from "@/components/DnD/types";
import { createRegistry } from "@/components/DnD/registry";
import { ContentCard } from "../layout/Card";
import { useCallback } from "react";

interface SlideElementsBoardProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  orderedColumnIds: string[];
  onChange: (
    columnMap: ColumnMap<SlideElementDnDItemProps>,
    orderedIds: string[],
  ) => void;
  registry: ReturnType<typeof createRegistry>;
  instanceId: symbol;
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

export default function SlideElementsBoard({
  columnMap,
  orderedColumnIds,
  onChange,
  registry,
  instanceId,
  selectedElementId,
  onSelectElement,
  dropIndicator,
}: SlideElementsBoardProps) {
  /* ------------------------------------------------------------------ */
  /*  Column helpers                                                     */
  /* ------------------------------------------------------------------ */
  const addColumn = () => {
    const idx = orderedColumnIds.length;
    const color = COLUMN_COLORS[idx % COLUMN_COLORS.length];
    const id = `col-${crypto.randomUUID()}` as const;

    const newColumn: ColumnType<SlideElementDnDItemProps> = {
      title: `Column ${idx + 1}`,
      columnId: id,
      styles: {
        container: { border: `2px dashed ${color}`, width: "100%" },
        header: { bg: color, color: "white" },
      },
      items: [],
    };

    onChange(
      { ...columnMap, [id]: newColumn },
      [...orderedColumnIds, id],
    );
  };

  const removeColumn = (columnId: string) => {
    if (orderedColumnIds.length <= 1) return;
    const newMap = { ...columnMap };
    delete newMap[columnId];
    onChange(
      newMap,
      orderedColumnIds.filter((id) => id !== columnId),
    );
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
      <HStack mb={2} justify="flex-end">
        <Button size="sm" colorScheme="teal" onClick={addColumn}>
          Add Column
        </Button>
      </HStack>

      <ContentCard height={700}>
        <DnDBoardMain<SlideElementDnDItemProps>
          controlled
          columnMap={columnMap}
          orderedColumnIds={orderedColumnIds}
          CardComponent={CardWrapper}
          enableColumnReorder={false}
          onChange={(b) => onChange(b.columnMap, b.orderedColumnIds)}
          onRemoveColumn={removeColumn}
          externalDropIndicator={dropIndicator}
          instanceId={instanceId}
          registry={registry}
        />
      </ContentCard>
    </>
  );
}

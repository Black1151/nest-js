"use client";

import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import { ContentCard } from "../layout/Card";
import { useCallback } from "react";

interface SlideElementsBoardProps {
  board: BoardState<SlideElementDnDItemProps>;
  onChange: (board: BoardState<SlideElementDnDItemProps>) => void;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
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
  board,
  onChange,
  selectedElementId,
  onSelectElement,
}: SlideElementsBoardProps) {
  /* ------------------------------------------------------------------ */
  /*  Column helpers                                                     */
  /* ------------------------------------------------------------------ */
  const addColumn = () => {
    const idx = board.orderedColumnIds.length;
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

    onChange({
      ...board,
      columnMap: { ...board.columnMap, [id]: newColumn },
      orderedColumnIds: [...board.orderedColumnIds, id],
    });
  };

  const removeColumn = (columnId: string) => {
    if (board.orderedColumnIds.length <= 1) return;
    const newMap = { ...board.columnMap };
    delete newMap[columnId];
    onChange({
      ...board,
      columnMap: newMap,
      orderedColumnIds: board.orderedColumnIds.filter((id) => id !== columnId),
    });
  };

  const updateItem = useCallback(
    (updated: SlideElementDnDItemProps) => {
      const newMap = { ...board.columnMap };
      for (const colId of board.orderedColumnIds) {
        const col = newMap[colId];
        const idx = col.items.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          newMap[colId] = {
            ...col,
            items: [...col.items.slice(0, idx), updated, ...col.items.slice(idx + 1)],
          };
          break;
        }
      }
      onChange({ ...board, columnMap: newMap });
    },
    [board, onChange]
  );

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
        onChange={updateItem}
      />
    ),
    [selectedElementId, onSelectElement, updateItem]
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
          columnMap={board.columnMap}
          orderedColumnIds={board.orderedColumnIds}
          CardComponent={CardWrapper}
          enableColumnReorder={false}
          onChange={onChange}
          onRemoveColumn={removeColumn}
        />
      </ContentCard>
    </>
  );
}

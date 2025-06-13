"use client";
import { Box, HStack, Text, Button } from "@chakra-ui/react";
import BoardAttributesPane from "@/components/lesson/attributes-pane/BoardAttributesPane";
import ColumnAttributesPane from "@/components/lesson/attributes-pane/ColumnAttributesPane";
import ElementAttributesPane from "@/components/lesson/attributes-pane/ElementAttributesPane";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import { BoardRow } from "@/components/lesson/slide/SlideElementsContainer";

interface ThemeAttributesPaneProps {
  element: SlideElementDnDItemProps | null;
  column: ColumnType<SlideElementDnDItemProps> | null;
  board: BoardRow | null;
  onUpdateElement: (el: SlideElementDnDItemProps) => void;
  onUpdateColumn: (col: ColumnType<SlideElementDnDItemProps>) => void;
  onUpdateBoard: (board: BoardRow) => void;
  onSave: () => void;
}

export default function ThemeAttributesPane({
  element,
  column,
  board,
  onUpdateElement,
  onUpdateColumn,
  onUpdateBoard,
  onSave,
}: ThemeAttributesPaneProps) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" minW="250px">
      <HStack justify="space-between" mb={2}>
        <Text>Attributes</Text>
        <Button size="xs" onClick={onSave} isDisabled={!element}>
          Save Element
        </Button>
      </HStack>
      {element && <ElementAttributesPane element={element} onChange={onUpdateElement} />}
      {column && <ColumnAttributesPane column={column} onChange={onUpdateColumn} />}
      {board && <BoardAttributesPane board={board} onChange={onUpdateBoard} />}
    </Box>
  );
}

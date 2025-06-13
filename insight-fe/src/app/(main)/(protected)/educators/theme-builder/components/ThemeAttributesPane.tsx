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
  colorPalettes: { id: number; name: string; colors: string[] }[];
  selectedPaletteId: number | "";
  onUpdateElement: (el: SlideElementDnDItemProps) => void;
  onUpdateColumn: (col: ColumnType<SlideElementDnDItemProps>) => void;
  onUpdateBoard: (board: BoardRow) => void;
  onSave: (target: 'element' | 'column' | 'row') => void;
  onClone?: () => void;
  onDelete?: () => void;
}

export default function ThemeAttributesPane({
  element,
  column,
  board,
  colorPalettes,
  selectedPaletteId,
  onUpdateElement,
  onUpdateColumn,
  onUpdateBoard,
  onSave,
  onClone,
  onDelete,
}: ThemeAttributesPaneProps) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" minW="250px">
      <HStack justify="space-between" mb={2}>
        <Text>Attributes</Text>
        {element && (
          <Button size="xs" onClick={() => onSave('element')}>
            Save Element
          </Button>
        )}
        {column && (
          <Button size="xs" onClick={() => onSave('column')}>
            Save Column
          </Button>
        )}
        {board && (
          <Button size="xs" onClick={() => onSave('row')}>
            Save Row
          </Button>
        )}
      </HStack>
      {element && (
        <ElementAttributesPane
          element={element}
          onChange={onUpdateElement}
          onClone={onClone}
          onDelete={onDelete}
          colorPalettes={colorPalettes}
          selectedPaletteId={selectedPaletteId}
        />
      )}
      {column && (
        <ColumnAttributesPane
          column={column}
          onChange={onUpdateColumn}
          colorPalettes={colorPalettes}
          selectedPaletteId={selectedPaletteId}
        />
      )}
      {board && (
        <BoardAttributesPane
          board={board}
          onChange={onUpdateBoard}
          colorPalettes={colorPalettes}
          selectedPaletteId={selectedPaletteId}
        />
      )}
    </Box>
  );
}

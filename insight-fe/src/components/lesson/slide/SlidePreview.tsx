"use client";

import { Box, Stack } from "@chakra-ui/react";

import { ColumnMap } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import SlideElementRenderer from "./SlideElementRenderer";
import { BoardRow } from "./SlideElementsContainer";
import ElementWrapper from "../elements/ElementWrapper";
import { ColorPalette, ComponentVariant } from "@/theme/helpers";

interface SlidePreviewProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: BoardRow[];
  palette?: ColorPalette;
  variants?: ComponentVariant[];
}

export default function SlidePreview({
  columnMap,
  boards,
  palette,
  variants,
}: SlidePreviewProps) {
  return (
    <Stack gap={4}>
      {boards.map((board) => (
        <ElementWrapper
          key={board.id}
          styles={board.wrapperStyles}
          data-board-id={board.id}
        >
          <Box
            display="grid"
            gridTemplateColumns={`repeat(${board.orderedColumnIds.length}, 1fr)`}
            gap={board.spacing ?? 0}
          >
            {board.orderedColumnIds.map((colId) => {
              const column = columnMap[colId];
              if (!column) return null;
              return (
                <ElementWrapper
                  key={colId}
                  styles={column.wrapperStyles}
                  data-column-id={colId}
                >
                  <Stack gap={column.spacing ?? 2}>
                    {column.items.map((item) => (
                      <Box key={item.id} mb={2} data-card-id={item.id}>
                        <SlideElementRenderer
                          item={item}
                          palette={palette}
                          variants={variants}
                        />
                      </Box>
                    ))}
                  </Stack>
                </ElementWrapper>
              );
            })}
          </Box>
        </ElementWrapper>
      ))}
    </Stack>
  );
}

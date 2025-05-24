"use client";

import { Box, Stack } from "@chakra-ui/react";
import { ColumnMap } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import SlideElementRenderer from "./SlideElementRenderer";
import { BoardRow } from "./SlideElementsContainer";
import ElementWrapper from "./ElementWrapper";

interface SlidePreviewProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: BoardRow[];
}

export default function SlidePreview({ columnMap, boards }: SlidePreviewProps) {
  return (
    <Stack gap={4}>
      {boards.map((board) => (
        <ElementWrapper
          key={board.id}
          styles={board.wrapperStyles}
          display="grid"
          gridTemplateColumns={`repeat(${board.orderedColumnIds.length}, 1fr)`}
          gap={4}
        >
          {board.orderedColumnIds.map((colId) => {
            const column = columnMap[colId];
            if (!column) return null;
            return (
              <Stack key={colId} gap={2} data-column-id={colId}>
                {column.items.map((item) => (
                  <Box key={item.id} mb={2} data-card-id={item.id}>
                    <SlideElementRenderer item={item} />
                  </Box>
                ))}
              </Stack>
            );
          })}
        </ElementWrapper>
      ))}
    </Stack>
  );
}

"use client";

import { Box, Stack } from "@chakra-ui/react";
import ElementWrapper from "./ElementWrapper";
import { ColumnMap } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import SlideElementRenderer from "./SlideElementRenderer";
import { BoardRow } from "./SlideElementsContainer";

interface SlidePreviewProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: BoardRow[];
}

export default function SlidePreview({ columnMap, boards }: SlidePreviewProps) {
  return (
    <Stack gap={4}>
      {boards.map((board) => (
        <Box
          key={board.id}
          display="grid"
          gridTemplateColumns={`repeat(${board.orderedColumnIds.length}, 1fr)`}
          gap={board.spacing ?? 4}
        >
          {board.orderedColumnIds.map((colId) => {
            const column = columnMap[colId];
            if (!column) return null;
            return (
              <ElementWrapper key={colId} styles={column.wrapperStyles} data-column-id={colId}>
                <Stack gap={column.spacing ?? 2}>
                  {column.items.map((item) => (
                    <Box key={item.id} mb={2} data-card-id={item.id}>
                      <SlideElementRenderer item={item} />
                    </Box>
                  ))}
                </Stack>
              </ElementWrapper>
            );
          })}
        </Box>
      ))}
    </Stack>
  );
}

"use client";

import { Box, Flex, Stack } from "@chakra-ui/react";
import { ColumnMap } from "@/components/DnD/types";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { BoardRow } from "./SlideElementsContainer";

interface SlidePreviewProps {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: BoardRow[];
}

export default function SlidePreview({ columnMap, boards }: SlidePreviewProps) {
  return (
    <Stack gap={4}>
      {boards.map((board) => (
        <Flex key={board.id} gap={4} alignItems="flex-start">
          {board.orderedColumnIds.map((colId) => {
            const column = columnMap[colId];
            if (!column) return null;
            return (
              <Stack
                key={colId}
                flex="1"
                borderWidth="1px"
                borderStyle="dashed"
                borderColor="gray.300"
                p={2}
              >
                {column.items.map((item) => (
                  <Box key={item.id} mb={2}>
                    <SlideElementDnDItem item={item} />
                  </Box>
                ))}
              </Stack>
            );
          })}
        </Flex>
      ))}
    </Stack>
  );
}

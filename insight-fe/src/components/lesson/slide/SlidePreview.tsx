"use client";

import { Box, Stack } from "@chakra-ui/react";

import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import SlideElementRenderer from "./SlideElementRenderer";
import ElementWrapper from "../elements/ElementWrapper";
import { Slide } from "./SlideSequencer";

interface SlidePreviewProps {
  slide: Slide;
}

export default function SlidePreview({ slide }: SlidePreviewProps) {
  const { columnMap, boards, wrapperStyles, spacing } = slide;
  return (
    <ElementWrapper styles={wrapperStyles}>
      <Stack gap={spacing ?? 4}>
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
                          <SlideElementRenderer item={item} />
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
    </ElementWrapper>
  );
}

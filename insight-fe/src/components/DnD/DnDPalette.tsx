"use client";

import { HStack, Box } from "@chakra-ui/react";
import React from "react";

export interface DnDPaletteProps<T> {
  items: T[];
  ItemComponent: React.ComponentType<{ item: T }>;
  getDragData?: (item: T) => string;
  spacing?: number;
  testId?: string;
}

export function DnDPalette<T>({
  items,
  ItemComponent,
  getDragData = (item) => JSON.stringify(item),
  spacing = 2,
  testId,
}: DnDPaletteProps<T>) {
  return (
    <HStack overflowX="auto" spacing={spacing} data-testid={testId}>
      {items.map((item, idx) => (
        <Box
          key={idx}
          p={2}
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", getDragData(item))}
        >
          <ItemComponent item={item} />
        </Box>
      ))}
    </HStack>
  );
}
export default DnDPalette;

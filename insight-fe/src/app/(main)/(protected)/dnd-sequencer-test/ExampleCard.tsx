// ExampleCard.tsx (or in the same file for brevity)

import React from "react";
import { Box } from "@chakra-ui/react";
import { BaseCardDnD } from "@/components/DnD/types";

/** Extend your BaseCardDnD to add custom fields needed for display. */
export interface ExampleCard extends BaseCardDnD {
  title: string;
}

/**
 * A simple card component for rendering an item in our boards.
 * Expects a prop named "item" which is our ExampleCard type.
 */
export const ExampleCardComponent: React.FC<{ item: ExampleCard }> = ({
  item,
}) => {
  return (
    <Box
      border="1px solid #ccc"
      borderRadius="4px"
      p={2}
      bg="gray.50"
      _hover={{ bg: "gray.100" }}
    >
      {item.title}
    </Box>
  );
};

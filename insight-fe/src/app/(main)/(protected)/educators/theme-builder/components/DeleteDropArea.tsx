"use client";

import { Box, Icon } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface DeleteDropAreaProps {
  onDrop: (id: string) => void;
}

export default function DeleteDropArea({ onDrop }: DeleteDropAreaProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,
      canDrop: ({ source }) => source.data.type === "card",
      getData: () => ({ type: "delete" }),
      getIsSticky: () => true,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: ({ source }) => {
        setIsOver(false);
        if (source.data.type === "card" && source.data.itemId) {
          onDrop(source.data.itemId as string);
        }
      },
    });
  }, [onDrop]);

  return (
    <Box
      ref={ref}
      mt={2}
      p={4}
      w="full"
      minW="250px"
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={isOver ? "red.400" : "gray.300"}
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={isOver ? "red.50" : "transparent"}
      color={isOver ? "red.500" : "gray.500"}
      transition="background-color 0.2s ease, border-color 0.2s ease"
    >
      <Icon as={Trash2} boxSize={6} />
    </Box>
  );
}

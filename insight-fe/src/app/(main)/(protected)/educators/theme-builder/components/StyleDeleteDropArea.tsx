"use client";

import { Box, Icon } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface StyleDeleteDropAreaProps {
  onDrop?: (id: number) => void;
}

export default function StyleDeleteDropArea({ onDrop }: StyleDeleteDropAreaProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.config?.styleId) {
        setIsOver(true);
      } else {
        setIsOver(false);
      }
    } catch {
      setIsOver(false);
    }
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const raw = e.dataTransfer.getData("text/plain");
    try {
      const parsed = JSON.parse(raw);
      const styleId = parsed?.config?.styleId;
      if (styleId) {
        onDrop?.(styleId);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="delete-style-area"
      p={4}
      minW="60px"
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

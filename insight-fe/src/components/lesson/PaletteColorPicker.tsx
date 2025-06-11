"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

interface PaletteColorPickerProps {
  /** Currently selected color index */
  value: number;
  /** Called when the user selects a color index */
  onChange: (index: number) => void;
  /** Colors available in the current palette */
  paletteColors?: string[];
}

export default function PaletteColorPicker({
  value,
  onChange,
  paletteColors = [],
}: PaletteColorPickerProps) {
  if (paletteColors.length === 0) {
    return (
      <Text fontSize="sm" color="gray.500">
        No colors available
      </Text>
    );
  }

  return (
    <HStack spacing={2} flexWrap="wrap">
      {paletteColors.map((color, idx) => (
        <Box
          key={idx}
          w="20px"
          h="20px"
          borderRadius="md"
          borderWidth={value === idx ? "2px" : "1px"}
          borderColor={value === idx ? "blue.500" : "gray.300"}
          cursor="pointer"
          bg={color}
          onClick={() => onChange(idx)}
        />
      ))}
    </HStack>
  );
}

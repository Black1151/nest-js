"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

interface PaletteColorPickerProps {
  /** Currently selected color value */
  value: string;
  /** Called when the user selects a color */
  onChange: (color: string) => void;
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
      {paletteColors.map((color) => (
        <Box
          key={color}
          w="20px"
          h="20px"
          borderRadius="md"
          borderWidth={value === color ? "2px" : "1px"}
          borderColor={value === color ? "blue.500" : "gray.300"}
          cursor="pointer"
          bg={color}
          onClick={() => onChange(color)}
        />
      ))}
    </HStack>
  );
}

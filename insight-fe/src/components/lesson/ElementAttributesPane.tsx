"use client";

import { Box, Stack, Text, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { useEffect, useState } from "react";

interface ElementAttributesPaneProps {
  element: SlideElementDnDItemProps;
  onChange: (updated: SlideElementDnDItemProps) => void;
}

export default function ElementAttributesPane({ element, onChange }: ElementAttributesPaneProps) {
  const [color, setColor] = useState(element.styles?.color || "#000000");
  const [fontSize, setFontSize] = useState(element.styles?.fontSize || "16px");
  const [text, setText] = useState(element.text || "");

  useEffect(() => {
    setColor(element.styles?.color || "#000000");
    setFontSize(element.styles?.fontSize || "16px");
    setText(element.text || "");
  }, [element]);

  useEffect(() => {
    if (element.type === "text") {
      onChange({
        ...element,
        text,
        styles: { ...element.styles, color, fontSize },
      });
    }
  }, [color, fontSize, text]);

  if (element.type !== "text") {
    return (
      <Box>
        <Text>No editable attributes</Text>
      </Box>
    );
  }

  return (
    <Stack>
      <FormControl>
        <FormLabel>Text</FormLabel>
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Color</FormLabel>
        <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Font Size (px)</FormLabel>
        <Input
          type="number"
          value={parseInt(fontSize)}
          onChange={(e) => setFontSize(e.target.value + "px")}
        />
      </FormControl>
    </Stack>
  );
}

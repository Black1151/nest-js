"use client";

import {
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
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
  const [url, setUrl] = useState(element.url || "");
  const [border, setBorder] = useState(element.styles?.border || "");
  const [borderRadius, setBorderRadius] = useState(element.styles?.borderRadius || "");
  const [boxShadow, setBoxShadow] = useState(element.styles?.boxShadow || "");
  const [marginTop, setMarginTop] = useState(element.styles?.marginTop || "0px");
  const [marginBottom, setMarginBottom] = useState(element.styles?.marginBottom || "0px");

  // Reset local state only when a new element is selected
  // using id/type avoids resets when the parent simply updates
  // the same element instance with new references
  useEffect(() => {
    setColor(element.styles?.color || "#000000");
    setFontSize(element.styles?.fontSize || "16px");
    setText(element.text || "");
    setUrl(element.url || "");
    setBorder(element.styles?.border || "");
    setBorderRadius(element.styles?.borderRadius || "");
    setBoxShadow(element.styles?.boxShadow || "");
    setMarginTop(element.styles?.marginTop || "0px");
    setMarginBottom(element.styles?.marginBottom || "0px");
  }, [element.id, element.type]);

  useEffect(() => {
    if (element.type === "text") {
      onChange({
        ...element,
        text,
        styles: { ...element.styles, color, fontSize },
      });
    } else if (element.type === "image") {
      onChange({
        ...element,
        url,
        styles: {
          ...element.styles,
          border,
          borderRadius,
          boxShadow,
          marginTop,
          marginBottom,
        },
      });
    }
  }, [color, fontSize, text, url, border, borderRadius, boxShadow, marginTop, marginBottom]);

  if (element.type === "text") {
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

  if (element.type === "image") {
    return (
      <Stack>
        <FormControl>
          <FormLabel>Image URL</FormLabel>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Border</FormLabel>
          <Input value={border} onChange={(e) => setBorder(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Border Radius</FormLabel>
          <Input value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Drop Shadow</FormLabel>
          <Input value={boxShadow} onChange={(e) => setBoxShadow(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Margin Top (px)</FormLabel>
          <Input
            type="number"
            value={parseInt(marginTop)}
            onChange={(e) => setMarginTop(e.target.value + "px")}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Margin Bottom (px)</FormLabel>
          <Input
            type="number"
            value={parseInt(marginBottom)}
            onChange={(e) => setMarginBottom(e.target.value + "px")}
          />
        </FormControl>
      </Stack>
    );
  }

  return (
    <Box>
      <Text>No editable attributes</Text>
    </Box>
  );
}

"use client";

import {
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
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
  const [bgColor, setBgColor] = useState(element.wrapperStyles?.bgColor || "#ffffff");
  const [shadow, setShadow] = useState(element.wrapperStyles?.dropShadow || "none");
  const [paddingX, setPaddingX] = useState(element.wrapperStyles?.paddingX ?? 0);
  const [paddingY, setPaddingY] = useState(element.wrapperStyles?.paddingY ?? 0);
  const [marginX, setMarginX] = useState(element.wrapperStyles?.marginX ?? 0);
  const [marginY, setMarginY] = useState(element.wrapperStyles?.marginY ?? 0);
  const [borderColor, setBorderColor] = useState(element.wrapperStyles?.borderColor || "#000000");
  const [borderWidth, setBorderWidth] = useState(element.wrapperStyles?.borderWidth ?? 0);

  // Reset local state only when a new element is selected
  // using id/type avoids resets when the parent simply updates
  // the same element instance with new references
  useEffect(() => {
    setColor(element.styles?.color || "#000000");
    setFontSize(element.styles?.fontSize || "16px");
    setText(element.text || "");
    setBgColor(element.wrapperStyles?.bgColor || "#ffffff");
    setShadow(element.wrapperStyles?.dropShadow || "none");
    setPaddingX(element.wrapperStyles?.paddingX ?? 0);
    setPaddingY(element.wrapperStyles?.paddingY ?? 0);
    setMarginX(element.wrapperStyles?.marginX ?? 0);
    setMarginY(element.wrapperStyles?.marginY ?? 0);
    setBorderColor(element.wrapperStyles?.borderColor || "#000000");
    setBorderWidth(element.wrapperStyles?.borderWidth ?? 0);
  }, [element.id, element.type]);

  useEffect(() => {
    const updated: SlideElementDnDItemProps = {
      ...element,
      wrapperStyles: {
        bgColor,
        dropShadow: shadow,
        paddingX,
        paddingY,
        marginX,
        marginY,
        borderColor,
        borderWidth,
      },
    };
    if (element.type === "text") {
      updated.text = text;
      updated.styles = { ...element.styles, color, fontSize };
    }
    onChange(updated);
  }, [color, fontSize, text, bgColor, shadow, paddingX, paddingY, marginX, marginY, borderColor, borderWidth]);

  return (
    <Stack>
      <FormControl>
        <FormLabel>Background Color</FormLabel>
        <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Shadow</FormLabel>
        <Select value={shadow} onChange={(e) => setShadow(e.target.value)}>
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">XL</option>
          <option value="2xl">2XL</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Padding X (px)</FormLabel>
        <Input type="number" value={paddingX} onChange={(e) => setPaddingX(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Padding Y (px)</FormLabel>
        <Input type="number" value={paddingY} onChange={(e) => setPaddingY(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Margin X (px)</FormLabel>
        <Input type="number" value={marginX} onChange={(e) => setMarginX(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Margin Y (px)</FormLabel>
        <Input type="number" value={marginY} onChange={(e) => setMarginY(parseInt(e.target.value))} />
      </FormControl>
      <FormControl>
        <FormLabel>Border Color</FormLabel>
        <Input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Border Width (px)</FormLabel>
        <Input type="number" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} />
      </FormControl>
      {element.type === "text" && (
        <>
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
            <Input type="number" value={parseInt(fontSize)} onChange={(e) => setFontSize(e.target.value + "px")} />
          </FormControl>
        </>
      )}
    </Stack>
  );
}

"use client";

import {
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
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
  const [borderRadius, setBorderRadius] = useState(element.wrapperStyles?.borderRadius || "md");

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
    setBorderRadius(element.wrapperStyles?.borderRadius || "md");
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
        borderRadius,
      },
    };
    if (element.type === "text") {
      updated.text = text;
      updated.styles = { ...element.styles, color, fontSize };
    }
    onChange(updated);
  }, [color, fontSize, text, bgColor, shadow, paddingX, paddingY, marginX, marginY, borderColor, borderWidth, borderRadius]);

  return (
    <Accordion allowMultiple defaultIndex={[0]}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Wrapper</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel px={0}>
          <Stack spacing={2} mt={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel m={0} w="40%">Background</FormLabel>
              <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel m={0} w="40%">Shadow</FormLabel>
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
              <FormLabel m={0}>Padding</FormLabel>
              <Stack spacing={1} ml={2} mt={1}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel m={0} w="40%">Horiz.</FormLabel>
                  <Input type="number" value={paddingX} onChange={(e) => setPaddingX(parseInt(e.target.value))} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel m={0} w="40%">Vert.</FormLabel>
                  <Input type="number" value={paddingY} onChange={(e) => setPaddingY(parseInt(e.target.value))} />
                </FormControl>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel m={0}>Margin</FormLabel>
              <Stack spacing={1} ml={2} mt={1}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel m={0} w="40%">Horiz.</FormLabel>
                  <Input type="number" value={marginX} onChange={(e) => setMarginX(parseInt(e.target.value))} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel m={0} w="40%">Vert.</FormLabel>
                  <Input type="number" value={marginY} onChange={(e) => setMarginY(parseInt(e.target.value))} />
                </FormControl>
              </Stack>
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Borders</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel px={0}>
          <Stack spacing={2} mt={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel m={0} w="40%">Color</FormLabel>
              <Input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel m={0} w="40%">Width</FormLabel>
              <Input type="number" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel m={0} w="40%">Radius</FormLabel>
              <Select value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
                <option value="2xl">XX-Large</option>
                <option value="3xl">XXX-Large</option>
                <option value="50%">Circular</option>
              </Select>
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      {element.type === "text" && (
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">Text</Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0}>
            <Stack spacing={2} mt={2}>
              <FormControl display="flex" alignItems="center">
                <FormLabel m={0} w="40%">Text</FormLabel>
                <Input value={text} onChange={(e) => setText(e.target.value)} />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel m={0} w="40%">Color</FormLabel>
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel m={0} w="40%">Size</FormLabel>
                <Input type="number" value={parseInt(fontSize)} onChange={(e) => setFontSize(e.target.value + "px")} />
              </FormControl>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      )}
    </Accordion>
  );
}

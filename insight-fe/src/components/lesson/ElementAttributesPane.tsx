"use client";

import {
  Box,
  Stack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { useEffect, useState } from "react";

interface ElementAttributesPaneProps {
  element: SlideElementDnDItemProps;
  onChange: (updated: SlideElementDnDItemProps) => void;
  onClone?: () => void;
}

export default function ElementAttributesPane({
  element,
  onChange,
  onClone,
}: ElementAttributesPaneProps) {
  const [color, setColor] = useState(element.styles?.color || "#000000");
  const [fontSize, setFontSize] = useState(element.styles?.fontSize || "16px");
  const [text, setText] = useState(element.text || "");
  const [src, setSrc] = useState(element.src || "");
  const [url, setUrl] = useState(element.url || "");
  const [bgColor, setBgColor] = useState(
    element.wrapperStyles?.bgColor || "#ffffff"
  );
  const [shadow, setShadow] = useState(
    element.wrapperStyles?.dropShadow || "none"
  );
  const [paddingX, setPaddingX] = useState(
    element.wrapperStyles?.paddingX ?? 0
  );
  const [paddingY, setPaddingY] = useState(
    element.wrapperStyles?.paddingY ?? 0
  );
  const [marginX, setMarginX] = useState(element.wrapperStyles?.marginX ?? 0);
  const [marginY, setMarginY] = useState(element.wrapperStyles?.marginY ?? 0);
  const [borderColor, setBorderColor] = useState(
    element.wrapperStyles?.borderColor || "#000000"
  );
  const [borderWidth, setBorderWidth] = useState(
    element.wrapperStyles?.borderWidth ?? 0
  );
  const [borderRadius, setBorderRadius] = useState(
    element.wrapperStyles?.borderRadius || "none"
  );

  // Reset local state only when a new element is selected
  // using id/type avoids resets when the parent simply updates
  // the same element instance with new references
  useEffect(() => {
    setColor(element.styles?.color || "#000000");
    setFontSize(element.styles?.fontSize || "16px");
    setText(element.text || "");
    setSrc(element.src || "");
    setUrl(element.url || "");
    setBgColor(element.wrapperStyles?.bgColor || "#ffffff");
    setShadow(element.wrapperStyles?.dropShadow || "none");
    setPaddingX(element.wrapperStyles?.paddingX ?? 0);
    setPaddingY(element.wrapperStyles?.paddingY ?? 0);
    setMarginX(element.wrapperStyles?.marginX ?? 0);
    setMarginY(element.wrapperStyles?.marginY ?? 0);
    setBorderColor(element.wrapperStyles?.borderColor || "#000000");
    setBorderWidth(element.wrapperStyles?.borderWidth ?? 0);
    setBorderRadius(element.wrapperStyles?.borderRadius || "none");
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
    if (element.type === "image") {
      updated.src = src;
    }
    if (element.type === "video") {
      updated.url = url;
    }
    onChange(updated);
  }, [
    color,
    fontSize,
    text,
    src,
    url,
    bgColor,
    shadow,
    paddingX,
    paddingY,
    marginX,
    marginY,
    borderColor,
    borderWidth,
    borderRadius,
  ]);

  return (
    <>
      <Accordion allowMultiple>
      <AccordionItem
        borderWidth="1px"
        borderColor="blue.300"
        borderRadius="md"
        mb={2}
      >
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Wrapper
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={2}>
          <Stack spacing={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">
                Background
              </FormLabel>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">
                Shadow
              </FormLabel>
              <Select
                size="sm"
                value={shadow}
                onChange={(e) => setShadow(e.target.value)}
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">XL</option>
                <option value="2xl">2XL</option>
              </Select>
            </FormControl>
            <Box>
              <Text fontSize="sm" mb={1}>
                Padding
              </Text>
              <HStack spacing={2}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    Horiz.
                  </FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    w="60px"
                    value={paddingX}
                    onChange={(e) => setPaddingX(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    Vert.
                  </FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    w="60px"
                    value={paddingY}
                    onChange={(e) => setPaddingY(parseInt(e.target.value))}
                  />
                </FormControl>
              </HStack>
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>
                Margin
              </Text>
              <HStack spacing={2}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    Horiz.
                  </FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    w="60px"
                    value={marginX}
                    onChange={(e) => setMarginX(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    Vert.
                  </FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    w="60px"
                    value={marginY}
                    onChange={(e) => setMarginY(parseInt(e.target.value))}
                  />
                </FormControl>
              </HStack>
            </Box>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem
        borderWidth="1px"
        borderColor="green.300"
        borderRadius="md"
        mb={2}
      >
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Borders
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={2}>
          <Stack spacing={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">
                Color
              </FormLabel>
              <Input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">
                Width
              </FormLabel>
              <Input
                size="sm"
                type="number"
                w="60px"
                value={borderWidth}
                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">
                Radius
              </FormLabel>
              <Select
                size="sm"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="50%">Circular</option>
              </Select>
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      {element.type === "text" && (
        <AccordionItem
          borderWidth="1px"
          borderColor="purple.300"
          borderRadius="md"
          mb={2}
        >
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Text
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <Stack spacing={2}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  Content
                </FormLabel>
                <Input
                  size="sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  Color
                </FormLabel>
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  Size
                </FormLabel>
                <Input
                  size="sm"
                  type="number"
                  w="60px"
                  value={parseInt(fontSize)}
                  onChange={(e) => setFontSize(e.target.value + "px")}
                />
              </FormControl>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      )}

      {element.type === "image" && (
        <AccordionItem
          borderWidth="1px"
          borderColor="purple.300"
          borderRadius="md"
          mb={2}
        >
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Image
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <Stack spacing={2}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  Source
                </FormLabel>
                <Input
                  size="sm"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                />
              </FormControl>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      )}

      {element.type === "video" && (
        <AccordionItem
          borderWidth="1px"
          borderColor="purple.300"
          borderRadius="md"
          mb={2}
        >
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Video
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <Stack spacing={2}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  URL
                </FormLabel>
                <Input
                  size="sm"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </FormControl>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      )}
      </Accordion>
      {onClone && (
        <VStack mt={4} spacing={2} align="stretch">
          <Button size="sm" colorScheme="teal" onClick={onClone} width="100%">
            Clone
          </Button>
        </VStack>
      )}
    </>
  );
}

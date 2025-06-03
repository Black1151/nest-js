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
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { BoardRow } from "./SlideElementsContainer";

interface BoardAttributesPaneProps {
  board: BoardRow;
  onChange: (updated: BoardRow) => void;
}

export default function BoardAttributesPane({ board, onChange }: BoardAttributesPaneProps) {
  const [bgColor, setBgColor] = useState(board.wrapperStyles?.bgColor || "#ffffff");
  const [bgOpacity, setBgOpacity] = useState(board.wrapperStyles?.bgOpacity ?? 1);
  const [shadow, setShadow] = useState(board.wrapperStyles?.dropShadow || "none");
  const [paddingX, setPaddingX] = useState(board.wrapperStyles?.paddingX ?? 0);
  const [paddingY, setPaddingY] = useState(board.wrapperStyles?.paddingY ?? 0);
  const [marginX, setMarginX] = useState(board.wrapperStyles?.marginX ?? 0);
  const [marginY, setMarginY] = useState(board.wrapperStyles?.marginY ?? 0);
  const [borderColor, setBorderColor] = useState(board.wrapperStyles?.borderColor || "#000000");
  const [borderWidth, setBorderWidth] = useState(board.wrapperStyles?.borderWidth ?? 0);
  const [borderRadius, setBorderRadius] = useState(board.wrapperStyles?.borderRadius || "none");
  const [spacing, setSpacing] = useState(board.spacing ?? 0);

  useEffect(() => {
    setBgColor(board.wrapperStyles?.bgColor || "#ffffff");
    setBgOpacity(board.wrapperStyles?.bgOpacity ?? 1);
    setShadow(board.wrapperStyles?.dropShadow || "none");
    setPaddingX(board.wrapperStyles?.paddingX ?? 0);
    setPaddingY(board.wrapperStyles?.paddingY ?? 0);
    setMarginX(board.wrapperStyles?.marginX ?? 0);
    setMarginY(board.wrapperStyles?.marginY ?? 0);
    setBorderColor(board.wrapperStyles?.borderColor || "#000000");
    setBorderWidth(board.wrapperStyles?.borderWidth ?? 0);
    setBorderRadius(board.wrapperStyles?.borderRadius || "none");
    setSpacing(board.spacing ?? 0);
  }, [board.id]);

  useEffect(() => {
    onChange({
      ...board,
      wrapperStyles: {
        bgColor,
        bgOpacity,
        dropShadow: shadow,
        paddingX,
        paddingY,
        marginX,
        marginY,
        borderColor,
        borderWidth,
        borderRadius,
      },
      spacing,
    });
  }, [bgColor, bgOpacity, shadow, paddingX, paddingY, marginX, marginY, borderColor, borderWidth, borderRadius, spacing]);

  return (
    <Accordion allowMultiple>
      <AccordionItem borderWidth="1px" borderColor="blue.300" borderRadius="md" mb={2}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Background</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={2}>
          <Stack spacing={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Color</FormLabel>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  setBgOpacity(1);
                }}
              />
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem borderWidth="1px" borderColor="blue.300" borderRadius="md" mb={2}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Wrapper</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={2}>
          <Stack spacing={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Shadow</FormLabel>
              <Select size="sm" value={shadow} onChange={(e) => setShadow(e.target.value)}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">XL</option>
                <option value="2xl">2XL</option>
              </Select>
            </FormControl>
            <Box>
              <Text fontSize="sm" mb={1}>Padding</Text>
              <HStack spacing={2}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">Horiz.</FormLabel>
                  <Input size="sm" type="number" w="60px" value={paddingX} onChange={(e) => setPaddingX(parseInt(e.target.value))} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">Vert.</FormLabel>
                  <Input size="sm" type="number" w="60px" value={paddingY} onChange={(e) => setPaddingY(parseInt(e.target.value))} />
                </FormControl>
              </HStack>
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>Margin</Text>
              <HStack spacing={2}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">Horiz.</FormLabel>
                  <Input size="sm" type="number" w="60px" value={marginX} onChange={(e) => setMarginX(parseInt(e.target.value))} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">Vert.</FormLabel>
                  <Input size="sm" type="number" w="60px" value={marginY} onChange={(e) => setMarginY(parseInt(e.target.value))} />
                </FormControl>
              </HStack>
            </Box>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Spacing</FormLabel>
              <Input size="sm" type="number" w="60px" value={spacing} onChange={(e) => setSpacing(parseInt(e.target.value))} />
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem borderWidth="1px" borderColor="green.300" borderRadius="md" mb={2}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Borders</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={2}>
          <Stack spacing={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Color</FormLabel>
              <Input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Width</FormLabel>
              <Input size="sm" type="number" w="60px" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Radius</FormLabel>
              <Select size="sm" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2x Large</option>
                <option value="3xl">3x Large</option>
                <option value="full">Fully Rounded</option>
                <option value="50%">Circular</option>
              </Select>
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

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
  const [gradientFrom, setGradientFrom] = useState(board.wrapperStyles?.gradientFrom || "");
  const [gradientTo, setGradientTo] = useState(board.wrapperStyles?.gradientTo || "");
  const [gradientDirection, setGradientDirection] = useState(
    board.wrapperStyles?.gradientDirection ?? 0
  );
  const [backgroundType, setBackgroundType] = useState(
    board.wrapperStyles?.gradientFrom && board.wrapperStyles?.gradientTo
      ? "gradient"
      : "color"
  );
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
    setGradientFrom(board.wrapperStyles?.gradientFrom || "");
    setGradientTo(board.wrapperStyles?.gradientTo || "");
    setGradientDirection(board.wrapperStyles?.gradientDirection ?? 0);
    setBackgroundType(
      board.wrapperStyles?.gradientFrom && board.wrapperStyles?.gradientTo
        ? "gradient"
        : "color"
    );
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
        gradientFrom,
        gradientTo,
        gradientDirection,
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
  }, [bgColor, bgOpacity, gradientFrom, gradientTo, gradientDirection, shadow, paddingX, paddingY, marginX, marginY, borderColor, borderWidth, borderRadius, spacing, backgroundType]);

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
              <FormLabel mb="0" fontSize="sm" w="40%">Type</FormLabel>
              <Select
                size="sm"
                value={backgroundType}
                onChange={(e) => {
                  const value = e.target.value as "color" | "gradient";
                  setBackgroundType(value);
                  if (value === "color") {
                    setGradientFrom("");
                    setGradientTo("");
                    setGradientDirection(0);
                  } else {
                    setBgColor("#ffffff");
                  }
                }}
              >
                <option value="color">Color</option>
                <option value="gradient">Gradient</option>
              </Select>
            </FormControl>
            {backgroundType === "color" && (
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
            )}
            {backgroundType === "gradient" && (
              <>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" w="40%">Grad. From</FormLabel>
                  <Input
                    type="color"
                    value={gradientFrom}
                    onChange={(e) => setGradientFrom(e.target.value)}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" w="40%">Grad. To</FormLabel>
                  <Input
                    type="color"
                    value={gradientTo}
                    onChange={(e) => setGradientTo(e.target.value)}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" w="40%">Direction</FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    w="60px"
                    value={gradientDirection}
                    onChange={(e) =>
                      setGradientDirection(parseInt(e.target.value))
                    }
                  />
                </FormControl>
              </>
            )}
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

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
import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface ColumnAttributesPaneProps {
  column: ColumnType<SlideElementDnDItemProps>;
  onChange: (updated: ColumnType<SlideElementDnDItemProps>) => void;
}

export default function ColumnAttributesPane({ column, onChange }: ColumnAttributesPaneProps) {
  const [bgColor, setBgColor] = useState(column.wrapperStyles?.bgColor || "#ffffff");
  const [shadow, setShadow] = useState(column.wrapperStyles?.dropShadow || "none");
  const [paddingX, setPaddingX] = useState(column.wrapperStyles?.paddingX ?? 0);
  const [paddingY, setPaddingY] = useState(column.wrapperStyles?.paddingY ?? 0);
  const [marginX, setMarginX] = useState(column.wrapperStyles?.marginX ?? 0);
  const [marginY, setMarginY] = useState(column.wrapperStyles?.marginY ?? 0);
  const [borderColor, setBorderColor] = useState(column.wrapperStyles?.borderColor || "#000000");
  const [borderWidth, setBorderWidth] = useState(column.wrapperStyles?.borderWidth ?? 0);
  const [borderRadius, setBorderRadius] = useState(column.wrapperStyles?.borderRadius || "none");

  useEffect(() => {
    setBgColor(column.wrapperStyles?.bgColor || "#ffffff");
    setShadow(column.wrapperStyles?.dropShadow || "none");
    setPaddingX(column.wrapperStyles?.paddingX ?? 0);
    setPaddingY(column.wrapperStyles?.paddingY ?? 0);
    setMarginX(column.wrapperStyles?.marginX ?? 0);
    setMarginY(column.wrapperStyles?.marginY ?? 0);
    setBorderColor(column.wrapperStyles?.borderColor || "#000000");
    setBorderWidth(column.wrapperStyles?.borderWidth ?? 0);
    setBorderRadius(column.wrapperStyles?.borderRadius || "none");
  }, [column.columnId]);

  useEffect(() => {
    onChange({
      ...column,
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
    });
  }, [bgColor, shadow, paddingX, paddingY, marginX, marginY, borderColor, borderWidth, borderRadius]);

  return (
    <Accordion allowMultiple>
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
              <FormLabel mb="0" fontSize="sm" w="40%">Background</FormLabel>
              <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </FormControl>
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
                <option value="50%">Circular</option>
              </Select>
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

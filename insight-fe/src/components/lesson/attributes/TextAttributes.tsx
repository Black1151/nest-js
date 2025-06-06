"use client";

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { availableFonts } from "@/theme/fonts";

interface TextAttributesProps {
  text: string;
  setText: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  fontSize: string;
  setFontSize: (val: string) => void;
  fontFamily: string;
  setFontFamily: (val: string) => void;
  fontWeight: string;
  setFontWeight: (val: string) => void;
  lineHeight: string;
  setLineHeight: (val: string) => void;
  textAlign: string;
  setTextAlign: (val: string) => void;
}

export default function TextAttributes({
  text,
  setText,
  color,
  setColor,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  fontWeight,
  setFontWeight,
  lineHeight,
  setLineHeight,
  textAlign,
  setTextAlign,
}: TextAttributesProps) {
  return (
    <AccordionItem borderWidth="1px" borderColor="purple.300" borderRadius="md" mb={2}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">Text</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <Stack spacing={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Content
            </FormLabel>
            <Input size="sm" value={text} onChange={(e) => setText(e.target.value)} />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Color
            </FormLabel>
            <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
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
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Font
            </FormLabel>
            <Select size="sm" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              {availableFonts.map((f) => (
                <option key={f.fontFamily} value={f.fontFamily}>
                  {f.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Weight
            </FormLabel>
            <Select size="sm" value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="bolder">Bolder</option>
              <option value="lighter">Lighter</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </Select>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Line Height
            </FormLabel>
            <Input
              size="sm"
              type="number"
              w="60px"
              value={parseFloat(lineHeight)}
              onChange={(e) => setLineHeight(e.target.value)}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Align
            </FormLabel>
            <Select size="sm" value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </Select>
          </FormControl>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}


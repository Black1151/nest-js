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
  Text,
  HStack,
} from "@chakra-ui/react";
import type useStyleAttributes from "../hooks/useStyleAttributes";
import PaletteColorPicker from "../PaletteColorPicker";
import { SemanticTokens, ThemeTokens, tokenColor } from "@/theme/helpers";

interface WrapperSettingsProps {
  attrs: ReturnType<typeof useStyleAttributes>;
  tokens?: ThemeTokens;
}

export default function WrapperSettings({ attrs, tokens }: WrapperSettingsProps) {
  const {
    bgColor,
    setBgColor,
    bgOpacity,
    setBgOpacity,
    gradientFrom,
    setGradientFrom,
    gradientTo,
    setGradientTo,
    gradientDirection,
    setGradientDirection,
    backgroundType,
    setBackgroundType,
    shadow,
    setShadow,
    paddingX,
    setPaddingX,
    paddingY,
    setPaddingY,
    marginX,
    setMarginX,
    marginY,
    setMarginY,
    borderColor,
    setBorderColor,
    borderWidth,
    setBorderWidth,
    borderRadius,
    setBorderRadius,
    spacing,
    setSpacing,
  } = attrs;

  const tokenKeys = tokens
    ? 'semanticTokens' in tokens
      ? Object.keys(tokens.semanticTokens?.colors ?? {})
      : Object.keys((tokens as any).colors ?? {})
    : [];

  return (
    <>
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
                <PaletteColorPicker
                  value={tokenKeys.indexOf(bgColor)}
                  onChange={(idx) => {
                    setBgColor(tokenKeys[idx]);
                    setBgOpacity(1);
                  }}
                  paletteColors={tokenKeys.map((k) => tokenColor(tokens, k) || "")}
                />
              </FormControl>
            )}
            {backgroundType === "gradient" && (
              <>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" w="40%">Grad. From</FormLabel>
                  <PaletteColorPicker
                    value={tokenKeys.indexOf(gradientFrom)}
                    onChange={(idx) => setGradientFrom(tokenKeys[idx])}
                    paletteColors={tokenKeys.map((k) => tokenColor(tokens, k) || "")}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" w="40%">Grad. To</FormLabel>
                  <PaletteColorPicker
                    value={tokenKeys.indexOf(gradientTo)}
                    onChange={(idx) => setGradientTo(tokenKeys[idx])}
                    paletteColors={tokenKeys.map((k) => tokenColor(tokens, k) || "")}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" w="40%">Direction</FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    w="60px"
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(parseInt(e.target.value))}
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
              <FormLabel mb="0" fontSize="sm" w="40%">
                Shadow
              </FormLabel>
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
            {typeof spacing !== "undefined" && typeof setSpacing !== "undefined" && (
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  Spacing
                </FormLabel>
                <Input
                  size="sm"
                  type="number"
                  w="60px"
                  value={spacing}
                  onChange={(e) => setSpacing(parseInt(e.target.value))}
                />
              </FormControl>
            )}
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
              <FormLabel mb="0" fontSize="sm" w="40%">
                Color
              </FormLabel>
              <PaletteColorPicker
                value={tokenKeys.indexOf(borderColor)}
                onChange={(idx) => setBorderColor(tokenKeys[idx])}
                paletteColors={tokenKeys.map((k) => tokenColor(tokens, k) || "")}
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
    </>
  );
}

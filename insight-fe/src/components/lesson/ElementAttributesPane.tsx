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
  Icon,
} from "@chakra-ui/react";
import { availableFonts } from "@/theme/fonts";
import { Trash2 } from "lucide-react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import EditQuizModal from "./EditQuizModal";
import { useEffect, useState } from "react";
import useStyleAttributes from "./hooks/useStyleAttributes";

interface ElementAttributesPaneProps {
  element: SlideElementDnDItemProps;
  onChange: (updated: SlideElementDnDItemProps) => void;
  onClone?: () => void;
  onDelete?: () => void;
}

export default function ElementAttributesPane({
  element,
  onChange,
  onClone,
  onDelete,
}: ElementAttributesPaneProps) {
  const [color, setColor] = useState(element.styles?.color || "#000000");
  const [fontSize, setFontSize] = useState(element.styles?.fontSize || "16px");
  const [fontFamily, setFontFamily] = useState(
    element.styles?.fontFamily || availableFonts[0].fontFamily
  );
  const [fontWeight, setFontWeight] = useState(
    element.styles?.fontWeight || "normal"
  );
  const [lineHeight, setLineHeight] = useState(
    element.styles?.lineHeight || "1.2"
  );
  const [textAlign, setTextAlign] = useState(
    element.styles?.textAlign || "left"
  );
  const [text, setText] = useState(element.text || "");
  const [src, setSrc] = useState(element.src || "");
  const [url, setUrl] = useState(element.url || "");
  const [title, setTitle] = useState(element.title || "");
  const [description, setDescription] = useState(element.description || "");
  const [questions, setQuestions] = useState(
    element.questions || ([] as SlideElementDnDItemProps["questions"])
  );
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
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
  } = useStyleAttributes({
    wrapperStyles: element.wrapperStyles,
    deps: [element.id, element.type],
  });
  const [animationEnabled, setAnimationEnabled] = useState(
    !!element.animation
  );
  const [animationDirection, setAnimationDirection] = useState(
    element.animation?.direction || "left"
  );
  const [animationDelay, setAnimationDelay] = useState(
    element.animation?.delay ?? 0
  );

  // Reset local state only when a new element is selected
  // using id/type avoids resets when the parent simply updates
  // the same element instance with new references
  useEffect(() => {
    setColor(element.styles?.color || "#000000");
    setFontSize(element.styles?.fontSize || "16px");
    setFontFamily(element.styles?.fontFamily || availableFonts[0].fontFamily);
    setFontWeight(element.styles?.fontWeight || "normal");
    setLineHeight(element.styles?.lineHeight || "1.2");
    setTextAlign(element.styles?.textAlign || "left");
    setText(element.text || "");
    setSrc(element.src || "");
    setUrl(element.url || "");
    setTitle(element.title || "");
    setDescription(element.description || "");
    setQuestions(element.questions || []);
    setAnimationEnabled(!!element.animation);
    setAnimationDirection(element.animation?.direction || "left");
    setAnimationDelay(element.animation?.delay ?? 0);
  }, [element.id, element.type]);

  useEffect(() => {
    const updated: SlideElementDnDItemProps = {
      ...element,
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
      animation: animationEnabled
        ? { type: "flyInFade", direction: animationDirection, delay: animationDelay }
        : undefined,
    };
    if (element.type === "text") {
      updated.text = text;
      updated.styles = {
        ...element.styles,
        color,
        fontSize,
        fontFamily,
        fontWeight,
        lineHeight,
        textAlign,
      };
    }
    if (element.type === "image") {
      updated.src = src;
    }
    if (element.type === "video") {
      updated.url = url;
    }
    if (element.type === "quiz") {
      updated.title = title;
      updated.description = description;
      updated.questions = questions;
    }
    onChange(updated);
  }, [
    color,
    fontSize,
    fontFamily,
    fontWeight,
    lineHeight,
    textAlign,
    text,
    src,
    url,
    title,
    description,
    questions,
    bgColor,
    bgOpacity,
    gradientFrom,
    gradientTo,
    gradientDirection,
    shadow,
    paddingX,
    paddingY,
    marginX,
    marginY,
    borderColor,
    borderWidth,
    borderRadius,
    animationEnabled,
    animationDirection,
    animationDelay,
    backgroundType,
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
              Background
            </Box>
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

      <AccordionItem
        borderWidth="1px"
        borderColor="orange.300"
        borderRadius="md"
        mb={2}
      >
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Animation</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={2}>
          <Stack spacing={2}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Enable</FormLabel>
              <Select
                size="sm"
                value={animationEnabled ? "on" : "off"}
                onChange={(e) => setAnimationEnabled(e.target.value === "on")}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </Select>
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Direction</FormLabel>
              <Select
                size="sm"
                value={animationDirection}
                onChange={(e) =>
                  setAnimationDirection(e.target.value as any)
                }
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </Select>
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" w="40%">Delay (ms)</FormLabel>
              <Input
                size="sm"
                type="number"
                w="60px"
                value={animationDelay}
                onChange={(e) => setAnimationDelay(parseInt(e.target.value))}
              />
            </FormControl>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

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
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm" w="40%">
                  Font
                </FormLabel>
                <Select
                  size="sm"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
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
                <Select
                  size="sm"
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                >
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
                <Select
                  size="sm"
                  value={textAlign}
                  onChange={(e) => setTextAlign(e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </Select>
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

      {element.type === "quiz" && (
        <AccordionItem
          borderWidth="1px"
          borderColor="purple.300"
          borderRadius="md"
          mb={2}
        >
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">Quiz</Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2}>
            <Button size="sm" onClick={() => setIsQuizModalOpen(true)}>
              Edit Quiz
            </Button>
            <EditQuizModal
              isOpen={isQuizModalOpen}
              onClose={() => setIsQuizModalOpen(false)}
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              questions={questions}
              setQuestions={setQuestions}
            />
          </AccordionPanel>
        </AccordionItem>
      )}
      </Accordion>
      {(onClone || onDelete) && (
        <HStack mt={4} spacing={2} align="stretch">
          {onClone && (
            <Button size="sm" colorScheme="teal" onClick={onClone} width="100%">
              Clone
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              colorScheme="red"
              onClick={onDelete}
              width="100%"
              leftIcon={<Icon as={Trash2} boxSize={4} />}
            >
              Delete
            </Button>
          )}
        </HStack>
      )}
    </>
  );
}

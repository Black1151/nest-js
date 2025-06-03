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
  const [bgColor, setBgColor] = useState(
    element.wrapperStyles?.bgColor || "#ffffff"
  );
  const [bgOpacity, setBgOpacity] = useState(
    element.wrapperStyles?.bgOpacity ?? 0
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
    setBgColor(element.wrapperStyles?.bgColor || "#ffffff");
    setBgOpacity(element.wrapperStyles?.bgOpacity ?? 0);
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
              Background
            </Box>
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

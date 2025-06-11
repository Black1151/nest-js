"use client";

import { Box, Button, Accordion, HStack, Icon } from "@chakra-ui/react";
import { availableFonts } from "@/theme/fonts";
import { Trash2 } from "lucide-react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { useEffect, useState } from "react";
import QuizAttributes from "../attributes/QuizAttributes";
import AnimationSettings from "../attributes/AnimationSettings";
import ImageAttributes from "../attributes/ImageAttributes";
import TextAttributes from "../attributes/TextAttributes";
import VideoAttributes from "../attributes/VideoAttributes";
import TableAttributes from "../attributes/TableAttributes";
import WrapperSettings from "../attributes/WrapperSettings";
import useStyleAttributes from "../hooks/useStyleAttributes";
import { ComponentVariant, SemanticTokens } from "@/theme/helpers";

interface ElementAttributesPaneProps {
  element: SlideElementDnDItemProps;
  onChange: (updated: SlideElementDnDItemProps) => void;
  onClone?: () => void;
  onDelete?: () => void;
  tokens?: SemanticTokens;
  variants?: ComponentVariant[];
}

export default function ElementAttributesPane({
  element,
  onChange,
  onClone,
  onDelete,
  tokens,
  variants,
}: ElementAttributesPaneProps) {
  const [colorToken, setColorToken] = useState(
    element.styleOverrides?.colorToken ?? ""
  );
  const [fontSize, setFontSize] = useState(
    element.styleOverrides?.fontSize || "16px"
  );
  const [fontFamily, setFontFamily] = useState(
    element.styleOverrides?.fontFamily || availableFonts[0].fontFamily
  );
  const [fontWeight, setFontWeight] = useState(
    element.styleOverrides?.fontWeight || "normal"
  );
  const [lineHeight, setLineHeight] = useState(
    element.styleOverrides?.lineHeight || "1.2"
  );
  const [textAlign, setTextAlign] = useState(
    element.styleOverrides?.textAlign || "left"
  );
  const [text, setText] = useState(element.text || "");
  const [src, setSrc] = useState(element.src || "");
  const [url, setUrl] = useState(element.url || "");
  const [title, setTitle] = useState(element.title || "");
  const [description, setDescription] = useState(element.description || "");
  const [questions, setQuestions] = useState(
    element.questions || ([] as SlideElementDnDItemProps["questions"])
  );
  const [table, setTable] = useState(
    element.table || {
      rows: 2,
      cols: 2,
      cells: Array.from({ length: 2 }, () =>
        Array.from({ length: 2 }, () => ({ text: "", styleOverrides: { colorToken: "" } }))
      ),
    }
  );
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const styleAttrs = useStyleAttributes({
    wrapperStyles: element.wrapperStyles,
    deps: [element.id, element.type],
  });
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
  } = styleAttrs;
  const [animationEnabled, setAnimationEnabled] = useState(!!element.animation);
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
    setColorToken(element.styleOverrides?.colorToken ?? "");
    setFontSize(element.styleOverrides?.fontSize || "16px");
    setFontFamily(
      element.styleOverrides?.fontFamily || availableFonts[0].fontFamily
    );
    setFontWeight(element.styleOverrides?.fontWeight || "normal");
    setLineHeight(element.styleOverrides?.lineHeight || "1.2");
    setTextAlign(element.styleOverrides?.textAlign || "left");
    setText(element.text || "");
    setSrc(element.src || "");
    setUrl(element.url || "");
    setTitle(element.title || "");
    setDescription(element.description || "");
    setQuestions(element.questions || []);
    setTable(
      element.table || {
        rows: 2,
        cols: 2,
        cells: Array.from({ length: 2 }, () =>
          Array.from({ length: 2 }, () => ({ text: "", styleOverrides: { colorToken: "" } }))
        ),
      }
    );
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
        ? {
            type: "flyInFade",
            direction: animationDirection,
            delay: animationDelay,
          }
        : undefined,
    };
    if (element.type === "text") {
      updated.text = text;
      updated.styleOverrides = {
        ...element.styleOverrides,
        colorToken,
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
    if (element.type === "table") {
      updated.table = table;
    }
    onChange(updated);
  }, [
        colorToken,
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
    table,
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
        <WrapperSettings attrs={styleAttrs} tokens={tokens} />
        <AnimationSettings
          enabled={animationEnabled}
          setEnabled={setAnimationEnabled}
          direction={animationDirection}
          setDirection={setAnimationDirection}
          delay={animationDelay}
          setDelay={setAnimationDelay}
        />
        {element.type === "text" && (
          <TextAttributes
            text={text}
            setText={setText}
            colorToken={colorToken}
            setColorToken={setColorToken}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontWeight={fontWeight}
            setFontWeight={setFontWeight}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            textAlign={textAlign}
            setTextAlign={setTextAlign}
            tokens={tokens}
            variants={variants}
          />
        )}
        {element.type === "image" && (
          <ImageAttributes src={src} setSrc={setSrc} />
        )}
        {element.type === "video" && (
          <VideoAttributes url={url} setUrl={setUrl} />
        )}
        {element.type === "table" && (
          <TableAttributes
            table={table}
            setTable={setTable}
            tokens={tokens}
          />
        )}
        {element.type === "quiz" && (
          <QuizAttributes
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            questions={questions}
            setQuestions={setQuestions}
          />
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

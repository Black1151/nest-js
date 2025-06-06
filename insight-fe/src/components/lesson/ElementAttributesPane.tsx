"use client";

import {
  Box,
  Button,
  Accordion,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { availableFonts } from "@/theme/fonts";
import { Trash2 } from "lucide-react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { useEffect, useState } from "react";
import useStyleAttributes from "./hooks/useStyleAttributes";
import WrapperSettings from "./attributes/WrapperSettings";
import AnimationSettings from "./attributes/AnimationSettings";
import TextAttributes from "./attributes/TextAttributes";
import ImageAttributes from "./attributes/ImageAttributes";
import VideoAttributes from "./attributes/VideoAttributes";
import QuizAttributes from "./attributes/QuizAttributes";

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
        <WrapperSettings attrs={styleAttrs} />
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
            color={color}
            setColor={setColor}
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
          />
        )}
        {element.type === "image" && (
          <ImageAttributes src={src} setSrc={setSrc} />
        )}
        {element.type === "video" && (
          <VideoAttributes url={url} setUrl={setUrl} />
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

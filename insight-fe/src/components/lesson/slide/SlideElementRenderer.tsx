"use client";

import React from "react";
import { Box, Text, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import ElementWrapper from "../elements/ElementWrapper";
import ImageElement from "../elements/ImageElement";
import QuizElement from "../elements/QuizElement";
import VideoElement from "../elements/VideoElement";

import { ComponentVariant, SemanticTokens, ThemeTokens, resolveVariant, tokenColor } from "@/theme/helpers";

interface SlideElementRendererProps {
  item: SlideElementDnDItemProps;
  tokens?: ThemeTokens;
  variants?: ComponentVariant[];
}

export default function SlideElementRenderer({
  item,
  tokens,
  variants,
}: SlideElementRendererProps) {
  const MotionBox = motion(Box);
  const variant = resolveVariant(variants, item.variantId);
  const ariaProps = variant?.accessibleName
    ? { "aria-label": variant.accessibleName }
    : {};
  const animationProps = item.animation
    ? {
        initial: {
          opacity: 0,
          x:
            item.animation.direction === "left"
              ? -50
              : item.animation.direction === "right"
              ? 50
              : 0,
          y:
            item.animation.direction === "top"
              ? -50
              : item.animation.direction === "bottom"
              ? 50
              : 0,
        },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: { delay: item.animation.delay / 1000 },
      }
    : {};
  let content: React.ReactElement = (
    <ElementWrapper styles={item.wrapperStyles} data-testid="unknown-element">
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ElementWrapper>
  );

  if (item.type === "text") {
    content = (
      <ElementWrapper styles={item.wrapperStyles} data-testid="text-element">
        <Text
          fontSize={item.styleOverrides?.fontSize}
          fontFamily={item.styleOverrides?.fontFamily}
          fontWeight={item.styleOverrides?.fontWeight}
          lineHeight={item.styleOverrides?.lineHeight}
          textAlign={item.styleOverrides?.textAlign as any}
          color={tokenColor(tokens, item.styleOverrides?.colorToken)}
          {...(resolveVariant(variants, item.variantId)?.props ?? {})}
        >
          {item.text || "Sample Text"}
        </Text>
      </ElementWrapper>
    );
  } else if (item.type === "table") {
    content = (
      <ElementWrapper styles={item.wrapperStyles} data-testid="table-element">
        <Table size="sm">
          <Tbody>
            {item.table?.cells.map((row, rIdx) => (
              <Tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <Td key={cIdx} p={1}>
                    <Text
                      fontSize={cell.styleOverrides?.fontSize}
                      fontFamily={cell.styleOverrides?.fontFamily}
                      fontWeight={cell.styleOverrides?.fontWeight}
                      lineHeight={cell.styleOverrides?.lineHeight}
                      textAlign={cell.styleOverrides?.textAlign as any}
                      color={tokenColor(tokens, cell.styleOverrides?.colorToken)}
                    >
                      {cell.text}
                    </Text>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ElementWrapper>
    );
  } else if (item.type === "image") {
    content = (
      <ImageElement
        src={item.src || ""}
        alt={variant?.accessibleName}
        wrapperStyles={item.wrapperStyles}
      />
    );
  } else if (item.type === "video") {
    content = (
      <VideoElement url={item.url || ""} wrapperStyles={item.wrapperStyles} />
    );
  } else if (item.type === "quiz") {
    content = (
      <QuizElement
        title={item.title || "Untitled Quiz"}
        description={item.description}
        questions={item.questions || []}
        wrapperStyles={item.wrapperStyles}
      />
    );
  }

  return (
    <MotionBox {...animationProps} {...ariaProps}>
      {content}
    </MotionBox>
  );
}

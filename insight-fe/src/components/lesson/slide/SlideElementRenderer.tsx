"use client";

import React from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import ElementWrapper from "../elements/ElementWrapper";
import ImageElement from "../elements/ImageElement";
import QuizElement from "../elements/QuizElement";
import VideoElement from "../elements/VideoElement";

interface SlideElementRendererProps {
  item: SlideElementDnDItemProps;
}

export default function SlideElementRenderer({
  item,
}: SlideElementRendererProps) {
  const MotionBox = motion(Box);
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
          color={item.styles?.color}
          fontSize={item.styles?.fontSize}
          fontFamily={item.styles?.fontFamily}
          fontWeight={item.styles?.fontWeight}
          lineHeight={item.styles?.lineHeight}
          textAlign={item.styles?.textAlign as any}
        >
          {item.text || "Sample Text"}
        </Text>
      </ElementWrapper>
    );
  } else if (item.type === "table") {
    content = (
      <ElementWrapper styles={item.wrapperStyles} data-testid="table-element">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Header 1</Th>
              <Th>Header 2</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Cell</Td>
              <Td>Cell</Td>
            </Tr>
          </Tbody>
        </Table>
      </ElementWrapper>
    );
  } else if (item.type === "image") {
    content = (
      <ImageElement src={item.src || ""} wrapperStyles={item.wrapperStyles} />
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

  return <MotionBox {...animationProps}>{content}</MotionBox>;
}

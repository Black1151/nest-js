"use client";

import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import ElementWrapper from "./ElementWrapper";
import ImageElement from "./ImageElement";
import VideoElement from "./VideoElement";
import QuizElement from "./QuizElement";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import React from "react";

interface SlideElementRendererProps {
  item: SlideElementDnDItemProps;
  onSelect?: () => void;
  isSelected?: boolean;
  onChange?: (item: SlideElementDnDItemProps) => void;
}

export default function SlideElementRenderer({
  item,
  onSelect,
  isSelected,
  onChange,
}: SlideElementRendererProps) {
  if (item.type === "text") {
    return (
      <ElementWrapper
        styles={item.wrapperStyles}
        data-testid="text-element"
        borderColor={isSelected ? "blue.300" : undefined}
        borderWidth={isSelected ? 2 : undefined}
        onClick={onSelect}
      >
        <Text
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onChange?.({ ...item, text: e.currentTarget.textContent || "" })
          }
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
  }

  if (item.type === "table") {
    return (
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
  }

  if (item.type === "image") {
    return (
      <ImageElement
        src={item.src || ""}
        wrapperStyles={item.wrapperStyles}
        isSelected={isSelected}
        onSelect={onSelect}
        onChange={(src) => onChange?.({ ...item, src })}
      />
    );
  }

  if (item.type === "video") {
    return (
      <VideoElement
        url={item.url || ""}
        wrapperStyles={item.wrapperStyles}
        isSelected={isSelected}
        onSelect={onSelect}
        onChange={(url) => onChange?.({ ...item, url })}
      />
    );
  }

  if (item.type === "quiz") {
    return (
      <QuizElement
        title={item.title || "Untitled Quiz"}
        description={item.description}
        questions={item.questions || []}
        wrapperStyles={item.wrapperStyles}
        isSelected={isSelected}
        onSelect={onSelect}
      />
    );
  }

  return (
    <ElementWrapper
      styles={item.wrapperStyles}
      data-testid="unknown-element"
      borderColor={isSelected ? "blue.300" : undefined}
      borderWidth={isSelected ? 2 : undefined}
      onClick={onSelect}
    >
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ElementWrapper>
  );
}

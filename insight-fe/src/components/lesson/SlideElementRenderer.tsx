"use client";

import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import ElementWrapper from "./ElementWrapper";
import ImageElement from "./ImageElement";
import VideoElement from "./VideoElement";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface SlideElementRendererProps {
  item: SlideElementDnDItemProps;
}

export default function SlideElementRenderer({
  item,
}: SlideElementRendererProps) {
  if (item.type === "text") {
    return (
      <ElementWrapper styles={item.wrapperStyles} data-testid="text-element">
        <Text color={item.styles?.color} fontSize={item.styles?.fontSize}>
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
      <ImageElement src={item.src || ""} wrapperStyles={item.wrapperStyles} />
    );
  }

  if (item.type === "video") {
    return (
      <VideoElement url={item.url || ""} wrapperStyles={item.wrapperStyles} />
    );
  }

  return (
    <ElementWrapper styles={item.wrapperStyles} data-testid="unknown-element">
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ElementWrapper>
  );
}

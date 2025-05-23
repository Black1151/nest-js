"use client";

import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface SlideElementRendererProps {
  item: SlideElementDnDItemProps;
}

export default function SlideElementRenderer({ item }: SlideElementRendererProps) {
  if (item.type === "text") {
    return (
      <Text color={item.styles?.color} fontSize={item.styles?.fontSize} data-testid="text-element">
        {item.text || "Sample Text"}
      </Text>
    );
  }

  if (item.type === "table") {
    return (
      <Table size="sm" data-testid="table-element">
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
    );
  }

  return (
    <Box data-testid="unknown-element">
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </Box>
  );
}

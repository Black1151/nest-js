"use client";

import { Box, HStack, Select, Button } from "@chakra-ui/react";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";

interface SlideToolbarProps {
  availableElements: { type: string; label: string }[];
  styleCollections: { id: number; name: string }[];
  selectedCollectionId: number | "";
  onSelectCollection: (id: number | "") => void;
  styleItems: SlideElementDnDItemProps[];
  onFetchStyles: (element: string) => void;
}

export default function SlideToolbar({
  availableElements,
  styleCollections,
  selectedCollectionId,
  onSelectCollection,
  styleItems,
  onFetchStyles,
}: SlideToolbarProps) {
  return (
    <>
      <Box p={4} borderWidth="1px" borderRadius="md">
        <HStack>
          {availableElements.map((el) => (
            <Box
              key={el.type}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", el.type)}
              bgColor="white"
            >
              {el.label}
            </Box>
          ))}
        </HStack>
      </Box>
      <HStack mt={2} alignItems="flex-start">
        <Select
          placeholder="Select collection"
          value={selectedCollectionId}
          onChange={(e) =>
            onSelectCollection(
              e.target.value === "" ? "" : parseInt(e.target.value, 10)
            )
          }
        >
          {styleCollections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <HStack>
          {availableElements.map((el) => (
            <Button
              key={el.type}
              size="sm"
              onClick={() => onFetchStyles(el.type)}
            >
              {el.label}
            </Button>
          ))}
        </HStack>
      </HStack>
      {styleItems.length > 0 && (
        <HStack mt={2} overflowX="auto">
          {styleItems.map((item, idx) => (
            <Box
              key={idx}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({ type: item.type, config: item })
                )
              }
            >
              <SlideElementDnDItem item={item} />
            </Box>
          ))}
        </HStack>
      )}
    </>
  );
}

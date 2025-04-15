import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { RoleDnDItem } from "./RoleDnDItem";
import { Role } from "@/gqty";

type RoleListItemDnD = {
  id: string;
  name: string;
  description: string;
};

interface TwoColumnDnDProps {
  leftColHeader: string;
  rightColHeader: string;
  leftColColor: string;
  rightColColor: string;
  initialRightItems: RoleListItemDnD[];
  initialLeftItems: RoleListItemDnD[];
}

const TwoColumnDnD: React.FC<TwoColumnDnDProps> = ({
  leftColHeader,
  rightColHeader,
  leftColColor,
  rightColColor,
  initialRightItems,
  initialLeftItems,
}) => {
  const [leftItems, setLeftItems] =
    useState<RoleListItemDnD[]>(initialLeftItems);
  const [rightItems, setRightItems] =
    useState<RoleListItemDnD[]>(initialRightItems);

  useEffect(() => {
    setLeftItems(initialLeftItems);
    setRightItems(initialRightItems);
  }, [initialLeftItems, initialRightItems]);

  // Refs for tracking the dragged item and which column it came from
  const draggedItemIdRef = useRef<string | null>(null);
  const draggedItemSourceRef = useRef<"left" | "right" | null>(null);

  // Helper to figure out which column an item is in
  const getItemSourceColumn = (itemId: string): "left" | "right" | null => {
    if (leftItems.some((item) => item.id === itemId)) return "left";
    if (rightItems.some((item) => item.id === itemId)) return "right";
    return null;
  };

  // One-time registration of the drop targets
  useEffect(() => {
    const leftColumn = document.getElementById("left-column");
    const rightColumn = document.getElementById("right-column");
    if (!leftColumn || !rightColumn) return;

    // Set up drop target on left column
    dropTargetForElements({
      element: leftColumn,
      onDrop: () => {
        // Only move if the item came from the other column
        if (
          draggedItemIdRef.current &&
          draggedItemSourceRef.current === "right"
        ) {
          moveItem(draggedItemIdRef.current, "left");
        }
        draggedItemIdRef.current = null;
        draggedItemSourceRef.current = null;
      },
    });

    // Set up drop target on right column
    dropTargetForElements({
      element: rightColumn,
      onDrop: () => {
        // Only move if the item came from the other column
        if (
          draggedItemIdRef.current &&
          draggedItemSourceRef.current === "left"
        ) {
          moveItem(draggedItemIdRef.current, "right");
        }
        draggedItemIdRef.current = null;
        draggedItemSourceRef.current = null;
      },
    });

    // Initialize monitoring (optional, but recommended)
    const unsubscribe = monitorForElements({});

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [leftItems, rightItems]);

  // Register draggables for items in both columns
  useEffect(() => {
    const allItems = [...leftItems, ...rightItems];

    allItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (!element) return;

      // If not already registered, make it draggable
      if (!element.hasAttribute("data-draggable-registered")) {
        draggable({
          element,
          onDragStart: () => {
            draggedItemIdRef.current = item.id;
            draggedItemSourceRef.current = getItemSourceColumn(item.id);
          },
        });

        element.setAttribute("data-draggable-registered", "true");
      }
    });
  }, [leftItems, rightItems]);

  // Move the dragged item from one array to the other
  const moveItem = (itemId: string, target: "left" | "right") => {
    const allItems = [...leftItems, ...rightItems];
    const draggedItem = allItems.find((item) => item.id === itemId);
    if (!draggedItem) return;

    if (target === "left") {
      setRightItems((prev) => prev.filter((item) => item.id !== itemId));
      setLeftItems((prev) => [...prev, draggedItem]);
    } else {
      setLeftItems((prev) => prev.filter((item) => item.id !== itemId));
      setRightItems((prev) => [...prev, draggedItem]);
    }
  };

  return (
    <Flex
      justify="center"
      align="start"
      gap="8"
      p="8"
      width="100%"
      boxSizing="border-box"
    >
      {/* Left Column */}
      <Box
        id="left-column"
        flex="1"
        border="2px dashed teal"
        borderRadius="md"
        p="4"
        minHeight="400px"
      >
        <Heading size="md" mb="4">
          {leftColHeader}
        </Heading>
        {leftItems.map((item) => (
          <RoleDnDItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            bgColor={leftColColor}
          />
        ))}
      </Box>

      {/* Right Column */}
      <Box
        id="right-column"
        flex="1"
        border="2px dashed orange"
        borderRadius="md"
        p="4"
        minHeight="400px"
      >
        <Heading size="md" mb="4">
          {rightColHeader}
        </Heading>
        {rightItems.map((item) => (
          // <Box key={item.id} id={item.id}>
          <RoleDnDItem
            id={item.id}
            key={item.id}
            name={item.name}
            description={item.description}
            bgColor={rightColColor}
          />
          // </Box>
        ))}
      </Box>
    </Flex>
  );
};

export default TwoColumnDnD;

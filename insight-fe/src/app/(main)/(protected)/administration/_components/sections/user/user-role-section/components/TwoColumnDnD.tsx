import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface Item {
  id: string;
  label: string;
}

interface TwoColumnDnDProps {
  leftColHeader: string;
  rightColHeader: string;
  leftColColor: string;
  rightColColor: string;
  rightColItems: Item[];
  leftColItems: Item[];
}

const TwoColumnDnD: React.FC<TwoColumnDnDProps> = ({
  leftColHeader,
  rightColHeader,
  leftColColor,
  rightColColor,
  rightColItems: initialRightItems,
  leftColItems: initialLeftItems,
}) => {
  const [leftItems, setLeftItems] = useState<Item[]>(initialLeftItems);
  const [rightItems, setRightItems] = useState<Item[]>(initialRightItems);

  // Use a ref so the draggedItemId doesn't get recreated on re-renders
  const draggedItemIdRef = useRef<string | null>(null);

  // One-time registration of the drop targets
  useEffect(() => {
    const leftColumn = document.getElementById("left-column");
    const rightColumn = document.getElementById("right-column");
    if (!leftColumn || !rightColumn) return;

    // Set up drop target on left column
    dropTargetForElements({
      element: leftColumn,
      onDrop: () => {
        if (!draggedItemIdRef.current) return;
        moveItem(draggedItemIdRef.current, "left");
        draggedItemIdRef.current = null;
      },
    });

    // Set up drop target on right column
    dropTargetForElements({
      element: rightColumn,
      onDrop: () => {
        if (!draggedItemIdRef.current) return;
        moveItem(draggedItemIdRef.current, "right");
        draggedItemIdRef.current = null;
      },
    });

    // Initialize monitoring (optional, but recommended)
    const unsubscribe = monitorForElements({});

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Register draggables for items in both columns.
  // If the same item is re‑rendered again, make sure not to double-register.
  // A simple approach: each render tries to call `draggable(...)`,
  // but only if we haven't already added a specific data attribute.
  useEffect(() => {
    [...leftItems, ...rightItems].forEach((item) => {
      const element = document.getElementById(item.id);
      if (!element) return;

      // If you want to guard against re-registering, check a custom attribute:
      if (!element.hasAttribute("data-draggable-registered")) {
        draggable({
          element,
          onDragStart: () => {
            draggedItemIdRef.current = item.id;
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
      height="80vh"
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
          <Box
            key={item.id}
            id={item.id}
            bg={leftColColor}
            p="2"
            mb="2"
            borderRadius="md"
            cursor="grab"
          >
            <Text>{item.label}</Text>
          </Box>
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
          <Box
            key={item.id}
            id={item.id}
            bg={rightColColor}
            p="2"
            mb="2"
            borderRadius="md"
            cursor="grab"
          >
            <Text>{item.label}</Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};

export default TwoColumnDnD;

"use client";

import React, { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Box, Heading } from "@chakra-ui/react";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";

import { BaseCardDnD } from "@/components/DnD/types";
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import { SlideData } from "./DnDBoardSequencerOLd";

interface SlideContainerProps<TCard extends BaseCardDnD> {
  slide: SlideData<TCard>;
  CardComponent: React.ComponentType<{ item: TCard }>;
  reorderEnabled?: boolean;
}

export function SlideContainer<TCard extends BaseCardDnD>({
  slide,
  CardComponent,
  reorderEnabled = true,
}: SlideContainerProps<TCard>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLHeadingElement | null>(null);

  console.log("slide", slide);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    invariant(containerRef.current, "containerRef is not set");
    invariant(handleRef.current, "handleRef is not set");

    const disposables = [
      // 1) Make the entire container a drop target for other slides
      dropTargetForElements({
        element: containerRef.current,
        getData: ({ input, element }) => {
          const data = { slideId: slide.slideId };
          // attach closestEdge for left/right
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        canDrop: ({ source }) => source.data?.type === "slide-drag-handle",
      }),

      // 2) Auto-scroll while dragging a slide if near edges
      autoScrollForElements({
        element: containerRef.current,
        canScroll: ({ source }) => source.data?.type === "slide-drag-handle",
      }),
    ];

    // 3) If reorder is enabled, let the user actually drag this container
    if (reorderEnabled) {
      disposables.push(
        draggable({
          element: containerRef.current,
          dragHandle: handleRef.current,
          getInitialData: () => ({
            type: "slide-drag-handle",
            slideId: slide.slideId,
          }),
          onGenerateDragPreview: ({ nativeSetDragImage }) => {
            // For a custom drag preview:
            setCustomNativeDragPreview({
              getOffset: centerUnderPointer,
              render: ({ container }) => {
                container.textContent = slide.title;
                container.style.padding = "8px 12px";
                container.style.background = "rgba(0,0,0,0.75)";
                container.style.color = "#fff";
                container.style.borderRadius = "4px";
                container.style.fontSize = "0.85rem";
                return () => {
                  // cleanup
                };
              },
              nativeSetDragImage,
            });
          },
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        })
      );
    }

    return () => {
      disposables.forEach((fn) => fn());
    };
  }, [reorderEnabled, slide.slideId, slide.title]);

  return (
    <Box
      id={`slide-container-${slide.slideId}`}
      ref={containerRef}
      width="360px"
      minH="300px"
      border="2px solid #ccc"
      borderRadius="md"
      boxShadow={isDragging ? "outline" : "sm"}
      position="relative"
      p={2}
    >
      {/* The draggable “handle” for reordering the entire slide */}
      <Heading
        ref={handleRef}
        size="sm"
        cursor={reorderEnabled ? "grab" : "default"}
        bg="gray.300"
        p={2}
        borderRadius="md"
        userSelect="none"
        mb={2}
      >
        {slide.title}
      </Heading>

      {/* Render the child board that manages columns and cards */}
      <DnDBoardMain
        columnMap={slide.boardData.columnMap}
        orderedColumnIds={slide.boardData.orderedColumnIds}
        CardComponent={CardComponent}
        enableColumnReorder
        // ...any other props you want to pass in
      />
    </Box>
  );
}

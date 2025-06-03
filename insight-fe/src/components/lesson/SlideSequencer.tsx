"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Stack } from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap } from "@/components/DnD/types";
import type { ElementWrapperStyles } from "./ElementWrapper";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

export interface SlideBoard {
  id: string;
  orderedColumnIds: string[];
  wrapperStyles?: ElementWrapperStyles;
}

export interface Slide {
  id: string;
  title: string;
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: SlideBoard[];
}

export const createInitialBoard = (): {
  columnMap: ColumnMap<SlideElementDnDItemProps>;
  boards: SlideBoard[];
} => {
  const columnId = `col-${crypto.randomUUID()}`;
  const boardId = crypto.randomUUID();
  return {
    columnMap: {
      [columnId]: {
        title: "",
        columnId,
        styles: {
          container: { border: "1px dashed gray", width: "100%" },
          header: { bg: "red.300", color: "white", px: 2, py: 1 },
        },
        wrapperStyles: {
          bgColor: "#ffffff",
          bgOpacity: 0,
          dropShadow: "none",
          paddingX: 0,
          paddingY: 0,
          marginX: 0,
          marginY: 0,
          borderColor: "#000000",
          borderWidth: 0,
          borderRadius: "none",
        },
        items: [],
      },
    },
    boards: [
      {
        id: boardId,
        orderedColumnIds: [columnId],
        wrapperStyles: {
          bgColor: "#ffffff",
          bgOpacity: 0,
          dropShadow: "none",
          paddingX: 0,
          paddingY: 0,
          marginX: 0,
          marginY: 0,
          borderColor: "#000000",
          borderWidth: 0,
          borderRadius: "none",
        },
      },
    ],
  };
};

interface SlideItemProps {
  slide: Slide;
  instanceId: symbol;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

function SlideItem({
  slide,
  instanceId,
  onSelect,
  isSelected,
}: SlideItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          type: "slide",
          slideId: slide.id,
          instanceId,
        }),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "slide",
        getIsSticky: () => true,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { type: "slide", slideId: slide.id },
            {
              input,
              element,
              allowedEdges: ["top", "bottom"],
            },
          ),
        onDragEnter: (args) =>
          setClosestEdge(extractClosestEdge(args.self.data)),
        onDrag: (args) => setClosestEdge(extractClosestEdge(args.self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    );
  }, [instanceId, slide.id]);

  return (
    <Box
      ref={ref}
      p={3}
      borderWidth="1px"
      borderRadius="md"
      bg={isSelected ? "teal.100" : "white"}
      position="relative"
      cursor="grab"
      onClick={() => onSelect(slide.id)}
    >
      {slide.title}
      {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
    </Box>
  );
}

export interface SlideSequencerProps {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  selectedSlideId: string | null;
  onSelect: (id: string) => void;
}

export default function SlideSequencer({
  slides,
  setSlides,
  selectedSlideId,
  onSelect,
}: SlideSequencerProps) {
  const counter = useRef(slides.length + 1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceId = useRef(Symbol("slide-sequencer"));

  const addSlide = useCallback(() => {
    const id = crypto.randomUUID();
    counter.current += 1;
    setSlides((s) => {
      const initial = createInitialBoard();
      return [
        ...s,
        {
          id,
          title: `Slide ${s.length + 1}`,
          columnMap: initial.columnMap,
          boards: initial.boards,
        },
      ];
    });
  }, [setSlides]);

  useEffect(() => {
    if (!containerRef.current) return;
    return dropTargetForElements({
      element: containerRef.current,
      canDrop: ({ source }) =>
        source.data.instanceId === instanceId.current &&
        source.data.type === "slide",
      getData: () => ({ columnId: "slides" }),
      getIsSticky: () => true,
    });
  }, []);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.instanceId === instanceId.current,
      onDrop: ({ source, location }) => {
        if (source.data.type !== "slide") {
          return;
        }
        if (!location.current.dropTargets.length) {
          return;
        }

        const startIndex = slides.findIndex(
          (s) => s.id === source.data.slideId,
        );
        if (startIndex === -1) return;

        if (location.current.dropTargets.length === 1) {
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget: slides.length - 1,
            closestEdgeOfTarget: null,
            axis: "vertical",
          });
          setSlides((prev) =>
            reorder({ list: prev, startIndex, finishIndex: destinationIndex }),
          );
          return;
        }

        if (location.current.dropTargets.length === 2) {
          const [destinationRecord] = location.current.dropTargets;
          const indexOfTarget = slides.findIndex(
            (s) => s.id === destinationRecord.data.slideId,
          );
          const closestEdgeOfTarget = extractClosestEdge(
            destinationRecord.data,
          );
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });
          setSlides((prev) =>
            reorder({ list: prev, startIndex, finishIndex: destinationIndex }),
          );
        }
      },
    });
  }, [slides, setSlides]);

  return (
    <Stack spacing={4}>
      <Button onClick={addSlide} colorScheme="teal" alignSelf="flex-start">
        Add Slide
      </Button>
      <Stack ref={containerRef} gap={2}>
        {slides.map((slide) => (
          <SlideItem
            key={slide.id}
            slide={slide}
            instanceId={instanceId.current}
            onSelect={onSelect}
            isSelected={selectedSlideId === slide.id}
          />
        ))}
      </Stack>
    </Stack>
  );
}

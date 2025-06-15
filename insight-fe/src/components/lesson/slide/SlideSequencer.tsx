"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Stack } from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap } from "@/components/DnD/types";

import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { useSlideDnD } from "@/hooks/useSlideDnD";
import {
  defaultColumnWrapperStyles,
  defaultBoardWrapperStyles,
} from "../defaultStyles";
import { ElementWrapperStyles } from "../elements/ElementWrapper";

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
        },
        wrapperStyles: { ...defaultColumnWrapperStyles },
        items: [],
      },
    },
    boards: [
      {
        id: boardId,
        orderedColumnIds: [columnId],
        wrapperStyles: { ...defaultBoardWrapperStyles },
      },
    ],
  };
};

interface SlideItemProps {
  slide: Slide;
  instanceId: symbol;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onDelete?: (id: string) => void;
  orientation: "vertical" | "horizontal";
}

function SlideItem({
  slide,
  instanceId,
  onSelect,
  isSelected,
  onDelete,
  orientation,
}: SlideItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  // Initialize draggable slide item and track nearest edge for drop indication
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
              allowedEdges:
                orientation === "horizontal" ? ["left", "right"] : ["top", "bottom"],
            }
          ),
        onDragEnter: (args) =>
          setClosestEdge(extractClosestEdge(args.self.data)),
        onDrag: (args) => setClosestEdge(extractClosestEdge(args.self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
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
      {onDelete && (
        <Button
          size="xs"
          position="absolute"
          top="2px"
          right="2px"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(slide.id);
          }}
        >
          X
        </Button>
      )}
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
  onDelete?: (id: string) => void;
  orientation?: "vertical" | "horizontal";
}

export default function SlideSequencer({
  slides,
  setSlides,
  selectedSlideId,
  onSelect,
  onDelete,
  orientation = "vertical",
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

  // Setup drop targets and reorder logic via dedicated hook
  useSlideDnD(containerRef, slides, setSlides, instanceId, orientation);

  return (
    <Stack spacing={4} direction={orientation === "horizontal" ? "row" : "column"}>
      <Button onClick={addSlide} colorScheme="teal" alignSelf="flex-start">
        Add Slide
      </Button>
      <Stack
        ref={containerRef}
        gap={2}
        direction={orientation === "horizontal" ? "row" : "column"}
        overflowX={orientation === "horizontal" ? "auto" : "visible"}
      >
        {slides.map((slide) => (
          <SlideItem
            key={slide.id}
            slide={slide}
            instanceId={instanceId.current}
            onSelect={onSelect}
            isSelected={selectedSlideId === slide.id}
            onDelete={onDelete}
            orientation={orientation}
          />
        ))}
      </Stack>
    </Stack>
  );
}

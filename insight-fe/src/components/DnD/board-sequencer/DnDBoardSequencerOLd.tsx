"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import invariant from "tiny-invariant";
import { Flex, Button } from "@chakra-ui/react";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";

import { SlideContainer } from "./SlideContainer";
import { BaseCardDnD, ColumnMap } from "@/components/DnD/types"; // example import

// ------------------------------------------------------------------
// Generic “SlideData” describing each top-level board/slide
// ------------------------------------------------------------------
export interface SlideData<TCard extends BaseCardDnD> {
  slideId: string; // unique ID
  title: string; // user-friendly title
  boardData: {
    columnMap: ColumnMap<TCard>;
    orderedColumnIds: string[];
  };
}

// ------------------------------------------------------------------
// Props for the top-level <SlidesDnDMain />
// ------------------------------------------------------------------
interface DnDBoardSequencerProps<TCard extends BaseCardDnD> {
  /** The array of slides (each containing its own board data). */
  slides: SlideData<TCard>[];

  /** The Card component used inside each slide’s DnDBoardMain. */
  CardComponent: React.ComponentType<{ item: TCard }>;

  /** Called on “Submit” to let you know the new slides order (optional). */
  onSubmit?: (slidesInOrder: SlideData<TCard>[]) => void;

  /** Whether to render a submit button for demonstration. */
  showSubmitButton?: boolean;
}

// ------------------------------------------------------------------
// Internally track a reorder outcome for slides
// ------------------------------------------------------------------
type SlideReorderOutcome = {
  type: "slide-reorder";
  slideId: string;
  startIndex: number;
  finishIndex: number;
};

type Trigger = "pointer" | "keyboard";

type Operation = {
  trigger: Trigger;
  outcome: SlideReorderOutcome;
};

// ------------------------------------------------------------------
// Our local “slides + lastOperation” state
// ------------------------------------------------------------------
interface SlidesDnDState<TCard extends BaseCardDnD> {
  slides: SlideData<TCard>[];
  lastOperation: Operation | null;
}

// ------------------------------------------------------------------
// The main top-level DnD component for reordering entire slides horizontally
// ------------------------------------------------------------------
export function DnDBoardSequencer<TCard extends BaseCardDnD>({
  slides,
  CardComponent,
  onSubmit,
  showSubmitButton = false,
}: DnDBoardSequencerProps<TCard>) {
  // Store an array of slides in local state
  const [data, setData] = useState<SlidesDnDState<TCard>>({
    slides,
    lastOperation: null,
  });

  useEffect(() => {
    setData({ slides, lastOperation: null });
  }, [slides]);

  const stableData = useRef(data);
  useEffect(() => {
    stableData.current = data;
  }, [data]);

  // Announce reorder events (for accessibility)
  useEffect(() => {
    const { lastOperation } = data;
    if (!lastOperation) return;

    const { outcome, trigger } = lastOperation;
    if (outcome.type === "slide-reorder") {
      const { startIndex, finishIndex } = outcome;
      const { slides } = stableData.current;
      const droppedSlide = slides[finishIndex];

      // Trigger a post-move flash on the newly dropped slide’s DOM element:
      const element = document.getElementById(
        `slide-container-${droppedSlide.slideId}`
      );
      if (element) {
        triggerPostMoveFlash(element);
      }

      // Screen reader announcement if triggered by keyboard
      if (trigger === "keyboard") {
        liveRegion.announce(
          `Moved slide ${droppedSlide.slideId} from position ${
            startIndex + 1
          } to position ${finishIndex + 1}.`
        );
      }
    }
  }, [data]);

  // Cleanup live region on unmount
  useEffect(() => liveRegion.cleanup, []);

  // Reorder slides in state
  const reorderSlides = useCallback(
    ({
      startIndex,
      finishIndex,
      trigger = "pointer",
    }: {
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((prev) => {
        const outcome: SlideReorderOutcome = {
          type: "slide-reorder",
          slideId: prev.slides[startIndex].slideId,
          startIndex,
          finishIndex,
        };
        return {
          ...prev,
          slides: reorder({
            list: prev.slides,
            startIndex,
            finishIndex,
          }),
          lastOperation: { outcome, trigger },
        };
      });
    },
    []
  );

  // Listen for drag “drop” events from any “slide” type draggables
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          // Only monitor if the item is recognized as a "slide-drag-handle"
          return source.data && source.data.type === "slide-drag-handle";
        },
        onDrop(args) {
          const { source, location } = args;
          const { slides } = stableData.current;

          if (!location.current.dropTargets.length) return;

          const startIndex = slides.findIndex(
            (s) => s.slideId === source.data.slideId
          );
          invariant(startIndex !== -1, "Could not find slide in local state");

          // We only needed the “first” drop target in this design
          const target = location.current.dropTargets[0];
          const targetId = target.data.slideId;
          const indexOfTarget = slides.findIndex((s) => s.slideId === targetId);

          const closestEdge = extractClosestEdge(target.data);
          const finishIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget: closestEdge,
            axis: "horizontal",
          });

          reorderSlides({ startIndex, finishIndex, trigger: "pointer" });
        },
      })
    );
  }, [reorderSlides]);

  const handleSubmit = useCallback(() => {
    onSubmit?.(data.slides);
  }, [data.slides, onSubmit]);

  return (
    <Flex direction="column" gap={4} width="100%">
      {/* The row of slides */}
      <Flex direction="row" gap={4}>
        {data.slides.map((slide) => (
          <SlideContainer
            key={slide.slideId}
            slide={slide}
            CardComponent={CardComponent}
            reorderEnabled={true}
          />
        ))}
      </Flex>

      {showSubmitButton && (
        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit Slides
        </Button>
      )}
    </Flex>
  );
}

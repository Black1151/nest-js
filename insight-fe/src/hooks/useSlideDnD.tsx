import { RefObject, useEffect } from "react";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { Slide } from "@/components/lesson/SlideSequencer";

/**
 * Hook wiring up drag-and-drop behaviour for the slide sequencer.
 * Handles registering the container as a drop target and monitors drop
 * events to update ordering.
 */
export function useSlideDnD(
  containerRef: RefObject<HTMLDivElement>,
  slides: Slide[],
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>,
  instanceId: React.MutableRefObject<symbol>,
  axis: "vertical" | "horizontal" = "vertical"
) {
  // Register the container to accept slide drops
  useEffect(() => {
    if (!containerRef.current) return;
    return dropTargetForElements({
      element: containerRef.current,
      canDrop: ({ source }) =>
        source.data.instanceId === instanceId.current && source.data.type === "slide",
      getData: () => ({ columnId: "slides" }),
      getIsSticky: () => true,
    });
  }, [containerRef, instanceId]);

  // Monitor drag events and update slide order on drop
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

        const startIndex = slides.findIndex((s) => s.id === source.data.slideId);
        if (startIndex === -1) return;

        if (location.current.dropTargets.length === 1) {
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget: slides.length - 1,
            closestEdgeOfTarget: null,
            axis,
          });
          setSlides((prev) => reorder({ list: prev, startIndex, finishIndex: destinationIndex }));
          return;
        }

        if (location.current.dropTargets.length === 2) {
          const [destinationRecord] = location.current.dropTargets;
          const indexOfTarget = slides.findIndex(
            (s) => s.id === destinationRecord.data.slideId
          );
          const closestEdgeOfTarget = extractClosestEdge(destinationRecord.data);
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
            axis,
          });
          setSlides((prev) => reorder({ list: prev, startIndex, finishIndex: destinationIndex }));
        }
      },
    });
  }, [instanceId, slides, setSlides, axis]);
}

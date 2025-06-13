import { RefObject, MutableRefObject, useEffect } from "react";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { ColumnMap } from "@/components/DnD/types";
import type { BoardRow } from "@/components/lesson/SlideElementsContainer";

/**
 * Hooks up drag-and-drop behaviour for the board container.
 * Handles drop target registration, auto scroll, board reordering and
 * moving columns between boards.
 *
 * @param containerRef - Ref for the container element
 * @param boards - Current board rows
 * @param columnMap - Map of columns indexed by id
 * @param onChange - Callback when boards or columns change
 * @param boardInstanceId - Symbol used for board level DnD
 * @param instanceId - Symbol used for column level DnD
 */
export function useContainerDragDrop(
  containerRef: RefObject<HTMLDivElement>,
  boards: BoardRow[],
  columnMap: ColumnMap<any>,
  onChange: (map: ColumnMap<any>, boards: BoardRow[]) => void,
  boardInstanceId: MutableRefObject<symbol>,
  instanceId: MutableRefObject<symbol>
) {
  useEffect(() => {
    if (!containerRef.current) return;
    return dropTargetForElements({
      element: containerRef.current,
      canDrop: ({ source }) =>
        source.data.instanceId === boardInstanceId.current &&
        source.data.type === "board",
      getData: () => ({ columnId: "boards" }),
      getIsSticky: () => true,
    });
  }, [containerRef, boardInstanceId]);

  useEffect(() => {
    return autoScrollWindowForElements({
      canScroll: ({ source }) =>
        source.data.instanceId === boardInstanceId.current &&
        source.data.type === "board",
    });
  }, [boardInstanceId]);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) =>
        source.data.instanceId === boardInstanceId.current,
      onDrop: ({ source, location }) => {
        if (source.data.type !== "board") return;
        if (!location.current.dropTargets.length) return;

        if (location.current.dropTargets.some((t) => t.data.type === "delete")) {
          return;
        }

        const startIndex = boards.findIndex(
          (b) => b.id === source.data.boardId
        );
        if (startIndex === -1) return;

        if (location.current.dropTargets.length === 1) {
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget: boards.length - 1,
            closestEdgeOfTarget: null,
            axis: "vertical",
          });
          const reordered = reorder({
            list: boards,
            startIndex,
            finishIndex: destinationIndex,
          });
          onChange(columnMap, reordered);
          return;
        }

        if (location.current.dropTargets.length === 2) {
          const [destinationRecord] = location.current.dropTargets;
          const indexOfTarget = boards.findIndex(
            (b) => b.id === destinationRecord.data.boardId
          );
          const closestEdgeOfTarget = extractClosestEdge(
            destinationRecord.data
          );
          const destinationIndex = getReorderDestinationIndex({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          });
          const reordered = reorder({
            list: boards,
            startIndex,
            finishIndex: destinationIndex,
          });
          onChange(columnMap, reordered);
        }
      },
    });
  }, [boards, columnMap, onChange, boardInstanceId]);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.instanceId === instanceId.current,
      onDrop: ({ source, location }) => {
        if (source.data.type !== "column") return;
        if (!location.current.dropTargets.length) return;

        if (location.current.dropTargets.some((t) => t.data.type === "delete")) {
          return;
        }

        const columnId = source.data.columnId as string;

        const startBoardIdx = boards.findIndex((b) =>
          b.orderedColumnIds.includes(columnId)
        );
        if (startBoardIdx === -1) return;

        const targetRecord = location.current.dropTargets.find(
          (t) => typeof t.data.columnId === "string"
        );
        if (!targetRecord) return;
        const targetColumnId = targetRecord.data.columnId as string;
        const destBoardIdx = boards.findIndex((b) =>
          b.orderedColumnIds.includes(targetColumnId)
        );
        if (destBoardIdx === -1) return;

        if (startBoardIdx === destBoardIdx) {
          return;
        }

        const indexOfTarget = boards[destBoardIdx].orderedColumnIds.findIndex(
          (id) => id === targetColumnId
        );
        const closestEdge: Edge | null = extractClosestEdge(target.data);
        const insertIndex =
          closestEdge === "right" ? indexOfTarget + 1 : indexOfTarget;

        const updatedBoards = boards
          .map((b, idx) => {
            if (idx === startBoardIdx) {
              return {
                ...b,
                orderedColumnIds: b.orderedColumnIds.filter(
                  (id) => id !== columnId
                ),
              };
            }
            if (idx === destBoardIdx) {
              const ids = Array.from(b.orderedColumnIds);
              ids.splice(insertIndex, 0, columnId);
              return { ...b, orderedColumnIds: ids };
            }
            return b;
          })
          .filter((b) => b.orderedColumnIds.length > 0);

        onChange(columnMap, updatedBoards);
      },
    });
  }, [boards, columnMap, onChange, instanceId]);
}

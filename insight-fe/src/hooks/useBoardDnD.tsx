import { useEffect } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { BaseCardDnD, ColumnMap } from "@/components/DnD/types";

/**
 * Hook that wires up the board level drag-and-drop monitor.
 * It listens for drop events on columns and cards and delegates to the
 * provided mutator callbacks.
 */
export function useBoardDnD<TCard extends BaseCardDnD>(
  instanceId: symbol,
  getBoard: () => { columnMap: ColumnMap<TCard>; orderedColumnIds: string[] },
  reorderColumn: (args: { startIndex: number; finishIndex: number; trigger?: "pointer" | "keyboard" }) => void,
  reorderCard: (args: { columnId: string; startIndex: number; finishIndex: number; trigger?: "pointer" | "keyboard" }) => void,
  moveCard: (args: { startColumnId: string; finishColumnId: string; itemIndexInStartColumn: number; itemIndexInFinishColumn?: number; trigger?: "pointer" | "keyboard" }) => void,
) {
  // Monitor the DOM for drop events from draggables belonging to this board
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;
          if (!location.current.dropTargets.length) return;

          // Column drop handling
          if (source.data.type === "column") {
            const board = getBoard();
            const startIndex = board.orderedColumnIds.findIndex(
              (id) => id === source.data.columnId
            );
            if (startIndex === -1) return;

            const target = location.current.dropTargets[0];
            const indexOfTarget = board.orderedColumnIds.findIndex(
              (id) => id === target.data.columnId
            );
            if (indexOfTarget === -1) return;

            const closestEdgeOfTarget: Edge | null = extractClosestEdge(target.data);
            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "horizontal",
            });
            reorderColumn({ startIndex, finishIndex, trigger: "pointer" });
            return;
          }

          // Card drop handling
          if (source.data.type === "card") {
            const board = getBoard();
            const itemId = source.data.itemId as string;
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceColumnId = startColumnRecord.data.columnId as string;
            const sourceColumn = board.columnMap[sourceColumnId];
            const itemIndex = sourceColumn.items.findIndex((i) => i.id === itemId);

            // Dropped directly onto a column
            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId as string;
              const destinationColumn = board.columnMap[destinationId];
              if (sourceColumn === destinationColumn) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: itemIndex,
                  indexOfTarget: sourceColumn.items.length - 1,
                  closestEdgeOfTarget: null,
                  axis: "vertical",
                });
                reorderCard({
                  columnId: sourceColumn.columnId,
                  startIndex: itemIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
              } else {
                moveCard({
                  itemIndexInStartColumn: itemIndex,
                  startColumnId: sourceColumn.columnId,
                  finishColumnId: destinationColumn.columnId,
                  trigger: "pointer",
                });
              }
              return;
            }

            // Dropped onto a card
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data.columnId as string;
              const destinationColumn = board.columnMap[destinationColumnId];
              const indexOfTarget = destinationColumn.items.findIndex(
                (i) => i.id === destinationCardRecord.data.itemId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                destinationCardRecord.data
              );

              if (sourceColumn === destinationColumn) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: itemIndex,
                  indexOfTarget,
                  closestEdgeOfTarget,
                  axis: "vertical",
                });
                reorderCard({
                  columnId: sourceColumn.columnId,
                  startIndex: itemIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
              } else {
                const destinationIndex =
                  closestEdgeOfTarget === "bottom" ? indexOfTarget + 1 : indexOfTarget;
                moveCard({
                  itemIndexInStartColumn: itemIndex,
                  startColumnId: sourceColumn.columnId,
                  finishColumnId: destinationColumn.columnId,
                  itemIndexInFinishColumn: destinationIndex,
                  trigger: "pointer",
                });
              }
            }
          }
        },
      })
    );
  }, [instanceId, reorderColumn, reorderCard, moveCard, getBoard]);
}

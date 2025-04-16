"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import invariant from "tiny-invariant";

import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

import {
  type ColumnMap,
  type ColumnType,
  getBasicData,
  type Person,
} from "./data/people";
import Board from "./Board";
import { BoardContext, type BoardContextValue } from "./BoardContext";
import { Column } from "./Column";
import { createRegistry } from "./registry";

// -----------------------------------------------------------------------------
// Type definitions for the various outcomes of a drag-and-drop operation
// -----------------------------------------------------------------------------
type Outcome =
  | {
      type: "column-reorder";
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-reorder";
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-move";
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn: number;
    };

type Trigger = "pointer" | "keyboard";

type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};

type BoardState = {
  columnMap: ColumnMap;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};

export default function BoardExample() {
  /**
   * Main piece of local state, storing:
   *  - columnMap: the columns and their items
   *  - orderedColumnIds: the current ordering of columns
   *  - lastOperation: the last drag-and-drop operation performed (if any)
   */
  const [data, setData] = useState<BoardState>(() => {
    const base = getBasicData();
    return {
      ...base,
      lastOperation: null,
    };
  });

  /**
   * We keep a stable reference to our data in `stableData`
   * to avoid stale closures in various callbacks and effects.
   */
  const stableData = useRef(data);
  useEffect(() => {
    stableData.current = data;
  }, [data]);

  /**
   * Create a registry (via createRegistry()) to store DOM references
   * for columns and cards. This is useful when we need to manipulate
   * or focus elements post-drag.
   */
  const [registry] = useState(createRegistry);

  // Extract the last operation from our data state
  const { lastOperation } = data;

  /**
   * Handle side effects whenever a drag-and-drop operation finishes.
   * This effect is responsible for:
   *  - triggering visual flashes on moved elements
   *  - announcing changes for screen reader accessibility
   *  - focusing the moved card’s menu trigger if it was a card-move operation
   */
  useEffect(() => {
    if (lastOperation === null) {
      return;
    }

    const { outcome, trigger } = lastOperation;

    // -----------------------------------
    // Outcome: Column reorder
    // -----------------------------------
    if (outcome.type === "column-reorder") {
      const { startIndex, finishIndex } = outcome;

      const { columnMap, orderedColumnIds } = stableData.current;
      const sourceColumn = columnMap[orderedColumnIds[finishIndex]];

      // Trigger a post-move flash on the DOM element of the dropped column
      const entry = registry.getColumn(sourceColumn.columnId);
      triggerPostMoveFlash(entry.element);

      // Announce the reorder action via live region for screen readers
      liveRegion.announce(
        `You've moved ${sourceColumn.title} from position ${
          startIndex + 1
        } to position ${finishIndex + 1} of ${orderedColumnIds.length}.`
      );

      return;
    }

    // -----------------------------------
    // Outcome: Card reorder in the same column
    // -----------------------------------
    if (outcome.type === "card-reorder") {
      const { columnId, startIndex, finishIndex } = outcome;

      const { columnMap } = stableData.current;
      const column = columnMap[columnId];
      const item = column.items[finishIndex];

      // Trigger a post-move flash on the dropped card
      const entry = registry.getCard(item.userId);
      triggerPostMoveFlash(entry.element);

      // Only announce if this is a keyboard operation (pointer = no announcement)
      if (trigger !== "keyboard") {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.name} from position ${
          startIndex + 1
        } to position ${finishIndex + 1} of ${column.items.length} in the ${
          column.title
        } column.`
      );

      return;
    }

    // -----------------------------------
    // Outcome: Moving a card to a different column
    // -----------------------------------
    if (outcome.type === "card-move") {
      const {
        finishColumnId,
        itemIndexInStartColumn,
        itemIndexInFinishColumn,
      } = outcome;

      const data = stableData.current;
      const destinationColumn = data.columnMap[finishColumnId];
      const item = destinationColumn.items[itemIndexInFinishColumn];

      const finishPosition =
        typeof itemIndexInFinishColumn === "number"
          ? itemIndexInFinishColumn + 1
          : destinationColumn.items.length;

      // Trigger a post-move flash on the dropped card
      const entry = registry.getCard(item.userId);
      triggerPostMoveFlash(entry.element);

      // Only announce and focus if this is a keyboard operation
      if (trigger !== "keyboard") {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.name} from position ${
          itemIndexInStartColumn + 1
        } to position ${finishPosition} in the ${
          destinationColumn.title
        } column.`
      );

      // Manually restore focus to the card's action menu trigger
      // because the card has re-mounted in a different column.
      entry.actionMenuTrigger.focus();

      return;
    }
  }, [lastOperation, registry]);

  /**
   * Cleanup the live region on unmount.
   */
  useEffect(() => {
    return liveRegion.cleanup();
  }, []);

  /**
   * Provide a helper to retrieve all columns in order.
   * Using useCallback ensures we don't create a new function each render.
   */
  const getColumns = useCallback(() => {
    const { columnMap, orderedColumnIds } = stableData.current;
    return orderedColumnIds.map((columnId) => columnMap[columnId]);
  }, []);

  /**
   * Reorder an entire column (dragging columns themselves).
   * This is triggered when a column is moved horizontally.
   */
  const reorderColumn = useCallback(
    ({
      startIndex,
      finishIndex,
      trigger = "keyboard",
    }: {
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((data) => {
        const outcome: Outcome = {
          type: "column-reorder",
          columnId: data.orderedColumnIds[startIndex],
          startIndex,
          finishIndex,
        };

        return {
          ...data,
          // Use Atlaskit's reorder utility to reorder the array
          orderedColumnIds: reorder({
            list: data.orderedColumnIds,
            startIndex,
            finishIndex,
          }),
          lastOperation: {
            outcome,
            trigger,
          },
        };
      });
    },
    []
  );

  /**
   * Reorder a card within the same column (dragging cards vertically).
   */
  const reorderCard = useCallback(
    ({
      columnId,
      startIndex,
      finishIndex,
      trigger = "keyboard",
    }: {
      columnId: string;
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((data) => {
        const sourceColumn = data.columnMap[columnId];
        // Reorder the list of cards
        const updatedItems = reorder({
          list: sourceColumn.items,
          startIndex,
          finishIndex,
        });

        // Create an updated copy of the source column
        const updatedSourceColumn: ColumnType = {
          ...sourceColumn,
          items: updatedItems,
        };

        // Build new column map with updated column
        const updatedMap: ColumnMap = {
          ...data.columnMap,
          [columnId]: updatedSourceColumn,
        };

        const outcome: Outcome = {
          type: "card-reorder",
          columnId,
          startIndex,
          finishIndex,
        };

        return {
          ...data,
          columnMap: updatedMap,
          lastOperation: {
            trigger,
            outcome,
          },
        };
      });
    },
    []
  );

  /**
   * Move a card from one column to another. Optionally specify the index
   * in the destination column. If no index is provided, defaults to 0.
   */
  const moveCard = useCallback(
    ({
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
      trigger = "keyboard",
    }: {
      startColumnId: string;
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn?: number;
      trigger?: Trigger;
    }) => {
      // If the user is moving a card to the same column, do nothing
      if (startColumnId === finishColumnId) {
        return;
      }

      setData((data) => {
        const sourceColumn = data.columnMap[startColumnId];
        const destinationColumn = data.columnMap[finishColumnId];
        const item: Person = sourceColumn.items[itemIndexInStartColumn];

        // Calculate the new index for the item in the destination column
        const newIndexInDestination = itemIndexInFinishColumn ?? 0;
        const destinationItems = Array.from(destinationColumn.items);
        destinationItems.splice(newIndexInDestination, 0, item);

        // Create updated column map reflecting the removed and inserted item
        const updatedMap = {
          ...data.columnMap,
          [startColumnId]: {
            ...sourceColumn,
            items: sourceColumn.items.filter((i) => i.userId !== item.userId),
          },
          [finishColumnId]: {
            ...destinationColumn,
            items: destinationItems,
          },
        };

        const outcome: Outcome = {
          type: "card-move",
          finishColumnId,
          itemIndexInStartColumn,
          itemIndexInFinishColumn: newIndexInDestination,
        };

        return {
          ...data,
          columnMap: updatedMap,
          lastOperation: {
            outcome,
            trigger,
          },
        };
      });
    },
    []
  );

  // Unique ID to ensure only our instance's draggables/droppables monitor each other.
  const [instanceId] = useState(() => Symbol("instance-id"));

  /**
   * This effect sets up a monitor for elements in our DnD system.
   * Whenever a drop occurs, it figures out what was dropped and where,
   * and then updates our state (columns, cards) accordingly.
   */
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          // Only monitor if the item has the same instance ID (i.e., same board)
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;

          // If no drop targets, do nothing
          if (!location.current.dropTargets.length) {
            return;
          }

          // Determine whether a column or card was dropped
          if (source.data.type === "column") {
            const startIndex = data.orderedColumnIds.findIndex(
              (columnId) => columnId === source.data.columnId
            );

            const target = location.current.dropTargets[0];
            const indexOfTarget = data.orderedColumnIds.findIndex(
              (id) => id === target.data.columnId
            );
            const closestEdgeOfTarget: Edge | null = extractClosestEdge(
              target.data
            );

            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "horizontal",
            });

            reorderColumn({ startIndex, finishIndex, trigger: "pointer" });
          }

          // Card was dropped somewhere
          if (source.data.type === "card") {
            const itemId = source.data.itemId;
            invariant(typeof itemId === "string");

            // The second record in initial.dropTargets is the column record
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId;
            invariant(typeof sourceId === "string");
            const sourceColumn = data.columnMap[sourceId];
            const itemIndex = sourceColumn.items.findIndex(
              (item) => item.userId === itemId
            );

            // If there is only one drop target, it's a column drop
            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationId === "string");
              const destinationColumn = data.columnMap[destinationId];
              invariant(destinationColumn);

              // Reordering within the same column
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
                return;
              }

              // Moving to a different column
              moveCard({
                itemIndexInStartColumn: itemIndex,
                startColumnId: sourceColumn.columnId,
                finishColumnId: destinationColumn.columnId,
                trigger: "pointer",
              });
              return;
            }

            // If there are two drop targets, the first is the target card,
            // and the second is the target column
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationColumnId === "string");
              const destinationColumn = data.columnMap[destinationColumnId];

              // Find the index of the card that was hovered
              const indexOfTarget = destinationColumn.items.findIndex(
                (item) => item.userId === destinationCardRecord.data.itemId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                destinationCardRecord.data
              );

              // Reorder in the same column
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
                return;
              }

              // Move to a different column, placing card relative to target card
              const destinationIndex =
                closestEdgeOfTarget === "bottom"
                  ? indexOfTarget + 1
                  : indexOfTarget;

              moveCard({
                itemIndexInStartColumn: itemIndex,
                startColumnId: sourceColumn.columnId,
                finishColumnId: destinationColumn.columnId,
                itemIndexInFinishColumn: destinationIndex,
                trigger: "pointer",
              });
            }
          }
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, instanceId, moveCard, reorderCard, reorderColumn]);

  /**
   * Memoize the context value so it remains stable across re-renders.
   * This context is consumed by child components (`Board`, `Column`, etc.)
   */
  const contextValue: BoardContextValue = useMemo(() => {
    return {
      getColumns,
      reorderColumn,
      reorderCard,
      moveCard,
      registerCard: registry.registerCard,
      registerColumn: registry.registerColumn,
      instanceId,
    };
  }, [getColumns, reorderColumn, reorderCard, registry, moveCard, instanceId]);

  /**
   * Render the board, passing in a <BoardContext.Provider> so that
   * columns and cards can access the necessary operations and data.
   */
  return (
    <BoardContext.Provider value={contextValue}>
      <Board>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </Board>
    </BoardContext.Provider>
  );
}

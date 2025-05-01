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

import Board from "./board";
import { BoardContext, type BoardContextValue } from "./BoardContext";
import { Column } from "./column";
import { createRegistry } from "./registry";
import { BaseCardDnD, ColumnMap, ColumnType } from "./types";
import { Button, Flex } from "@chakra-ui/react";

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

export type BoardState<TCard extends BaseCardDnD> = {
  columnMap: ColumnMap<TCard>;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};

interface DnDBoardMainProps<TCard extends BaseCardDnD> {
  columnMap: ColumnMap<TCard>;
  orderedColumnIds: string[];
  CardComponent: React.ComponentType<{ item: TCard }>;
  enableColumnReorder?: boolean;
  onSubmit?: (boardData: BoardState<TCard>) => void;
  isLoading?: boolean;

  /**
   * Optional: Provide an existing instanceId so that
   * multiple boards can share the same DnD "universe."
   */
  providedInstanceId?: symbol;

  /**
   * The boardId that this instance represents.
   * We'll store this in the source data so that we can detect
   * if a drop is within the same board or a different board.
   */
  boardId?: string;
}

// Access the passed-in interface
export const DnDBoardMain = <TCard extends BaseCardDnD>({
  columnMap,
  orderedColumnIds,
  CardComponent,
  enableColumnReorder = true,
  onSubmit,
  isLoading = false,
  providedInstanceId,
  boardId = "default-board", // fallback if you prefer
}: DnDBoardMainProps<TCard>) => {
  /**
   * Main piece of local state, storing:
   *  - columnMap
   *  - orderedColumnIds
   *  - lastOperation
   */
  const [data, setData] = useState<BoardState<TCard>>({
    columnMap,
    orderedColumnIds,
    lastOperation: null,
  });

  useEffect(() => {
    setData({
      columnMap,
      orderedColumnIds,
      lastOperation: null,
    });
  }, [columnMap, orderedColumnIds]);

  /**
   * We keep a stable reference to our data in `stableData`
   * to avoid stale closures in various callbacks.
   */
  const stableData = useRef(data);
  useEffect(() => {
    stableData.current = data;
  }, [data]);

  // Create a registry to store references for columns/cards
  const [registry] = useState(createRegistry);

  const { lastOperation } = data;

  /**
   * Side effect to handle post-drop flashes and announcements
   * (unchanged from your original).
   */
  useEffect(() => {
    if (!lastOperation) {
      return;
    }

    const { outcome, trigger } = lastOperation;

    if (outcome.type === "column-reorder") {
      const { startIndex, finishIndex } = outcome;
      const { columnMap, orderedColumnIds } = stableData.current;
      const sourceColumn = columnMap[orderedColumnIds[finishIndex]];
      // post-move flash
      const entry = registry.getColumn(sourceColumn.columnId);
      triggerPostMoveFlash(entry.element);

      // announce
      liveRegion.announce(
        `You've moved ${sourceColumn.title} from position ${
          startIndex + 1
        } to position ${finishIndex + 1} of ${orderedColumnIds.length}.`
      );
      return;
    }

    if (outcome.type === "card-reorder") {
      const { columnId, startIndex, finishIndex } = outcome;
      const { columnMap } = stableData.current;
      const column = columnMap[columnId];
      const item = column.items[finishIndex];

      // post-move flash
      const entry = registry.getCard(item.id);
      triggerPostMoveFlash(entry.element);

      // only announce if keyboard
      if (trigger === "keyboard") {
        liveRegion.announce(
          `You've moved ${item.id} from position ${
            startIndex + 1
          } to position ${finishIndex + 1} of ${column.items.length} in the ${
            column.title
          } column.`
        );
      }
      return;
    }

    if (outcome.type === "card-move") {
      const {
        finishColumnId,
        itemIndexInStartColumn,
        itemIndexInFinishColumn,
      } = outcome;
      const data = stableData.current;
      const destinationColumn = data.columnMap[finishColumnId];
      const item = destinationColumn.items[itemIndexInFinishColumn];

      // post-move flash
      const entry = registry.getCard(item.id);
      triggerPostMoveFlash(entry.element);

      // announce if keyboard
      if (trigger === "keyboard") {
        const finishPosition = itemIndexInFinishColumn + 1;
        liveRegion.announce(
          `You've moved ${item.id} from position ${
            itemIndexInStartColumn + 1
          } to position ${finishPosition} in the ${
            destinationColumn.title
          } column.`
        );
      }
      return;
    }
  }, [lastOperation, registry]);

  // Cleanup live region on unmount
  useEffect(() => {
    return liveRegion.cleanup();
  }, []);

  // Helper: get columns in order
  const getColumns = useCallback(() => {
    const { columnMap, orderedColumnIds } = stableData.current;
    return orderedColumnIds.map((columnId) => columnMap[columnId]);
  }, []);

  // Reorder entire column
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
      if (!enableColumnReorder) {
        return;
      }
      setData((prev) => {
        const outcome: Outcome = {
          type: "column-reorder",
          columnId: prev.orderedColumnIds[startIndex],
          startIndex,
          finishIndex,
        };
        return {
          ...prev,
          orderedColumnIds: reorder({
            list: prev.orderedColumnIds,
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
    [enableColumnReorder]
  );

  // Reorder a card within the same column
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
      setData((prev) => {
        const sourceColumn = prev.columnMap[columnId];
        const updatedItems = reorder({
          list: sourceColumn.items,
          startIndex,
          finishIndex,
        });
        const updatedSourceColumn: ColumnType<TCard> = {
          ...sourceColumn,
          items: updatedItems,
        };
        const updatedMap: ColumnMap<TCard> = {
          ...prev.columnMap,
          [columnId]: updatedSourceColumn,
        };
        const outcome: Outcome = {
          type: "card-reorder",
          columnId,
          startIndex,
          finishIndex,
        };
        return {
          ...prev,
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

  // Move a card to a different column (within the same board)
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
      if (startColumnId === finishColumnId) {
        return;
      }
      setData((prev) => {
        const sourceColumn = prev.columnMap[startColumnId];
        const destinationColumn = prev.columnMap[finishColumnId];
        const item = sourceColumn.items[itemIndexInStartColumn];

        const newIndexInDestination = itemIndexInFinishColumn ?? 0;
        const destinationItems = Array.from(destinationColumn.items);
        destinationItems.splice(newIndexInDestination, 0, item);

        const updatedMap = {
          ...prev.columnMap,
          [startColumnId]: {
            ...sourceColumn,
            items: sourceColumn.items.filter((i) => i.id !== item.id),
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
          ...prev,
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

  // The instanceId we use for monitorForElements
  // If a parent provided one, use that. Otherwise, generate our own.
  const [instanceId] = useState(
    () => providedInstanceId ?? Symbol("instance-id")
  );

  /**
   * The local monitor for DnD events that are strictly within *this* board.
   * If the user is dragging a column/card from a *different* board, we do nothing here.
   * The parent (BoardSequencer) will handle cross-board moves.
   */
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          // Only monitor if the item has the same instanceId
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;
          if (!location.current.dropTargets.length) {
            return;
          }

          // If this source belongs to a different board, skip local logic
          // (Our "boardId" was put on the source data in registerColumn/registerCard, etc.)
          const sourceBoardId = source.data.boardId;
          if (sourceBoardId !== boardId) {
            // Different board => let parent handle it
            return;
          }

          // Now handle local moves (same board):
          if (source.data.type === "column") {
            const startIndex = data.orderedColumnIds.findIndex(
              (colId) => colId === source.data.columnId
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

          if (source.data.type === "card") {
            const itemId = source.data.itemId;
            invariant(typeof itemId === "string");

            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId as string;
            const sourceColumn = data.columnMap[sourceId];
            const itemIndex = sourceColumn.items.findIndex(
              (it: TCard) => it.id === itemId
            );

            // If there's only one drop target, it's a column drop
            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = data.columnMap[destinationId];
              if (destinationColumn === sourceColumn) {
                // reorder in same column
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
              // move card to different column (within same board)
              moveCard({
                startColumnId: sourceColumn.columnId,
                finishColumnId: destinationColumn.columnId,
                itemIndexInStartColumn: itemIndex,
                trigger: "pointer",
              });
              return;
            }

            // If there are two drop targets, the first is the card, the second is the column
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = data.columnMap[destinationColumnId];
              const indexOfTarget = destinationColumn.items.findIndex(
                (it) => it.id === destinationCardRecord.data.itemId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                destinationCardRecord.data
              );

              if (sourceColumn === destinationColumn) {
                // reorder in same column
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

              // move card to different column within same board
              const destinationIndex =
                closestEdgeOfTarget === "bottom"
                  ? indexOfTarget + 1
                  : indexOfTarget;
              moveCard({
                startColumnId: sourceColumn.columnId,
                finishColumnId: destinationColumn.columnId,
                itemIndexInStartColumn: itemIndex,
                itemIndexInFinishColumn: destinationIndex,
                trigger: "pointer",
              });
            }
          }
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, instanceId, boardId, reorderColumn, reorderCard, moveCard]);

  // Provide context
  const contextValue: BoardContextValue<TCard> = useMemo(() => {
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

  // Render
  return (
    <BoardContext.Provider value={contextValue}>
      <Flex
        flexDirection="column"
        gap={4}
        flex={1}
        justifyContent="space-between"
      >
        <Board>
          {data.orderedColumnIds.map((columnId) => (
            <Column
              column={data.columnMap[columnId]}
              key={columnId}
              CardComponent={CardComponent}
              enableColumnReorder={enableColumnReorder}
              isLoading={isLoading}
            />
          ))}
        </Board>

        {onSubmit && (
          <Button colorScheme="orange" onClick={() => onSubmit(data)}>
            Submit
          </Button>
        )}
      </Flex>
    </BoardContext.Provider>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
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
// Types for DnD outcomes
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

// -----------------------------------------------------------------------------
// Public board state
// -----------------------------------------------------------------------------
export type BoardState<TCard extends BaseCardDnD> = {
  columnMap: ColumnMap<TCard>;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};

// -----------------------------------------------------------------------------
// Component props
// -----------------------------------------------------------------------------
export interface DnDBoardMainProps<TCard extends BaseCardDnD> {
  columnMap: ColumnMap<TCard>;
  orderedColumnIds: string[];
  CardComponent: React.ComponentType<{ item: TCard }>;
  enableColumnReorder?: boolean;
  /**
   * Fired whenever the board state mutates.
   * Receives the **latest** state.
   */
  onChange?: (board: BoardState<TCard>) => void;
  /**
   * Optional callback rendered as a submit button.
   */
  onSubmit?: (board: BoardState<TCard>) => void;
  isLoading?: boolean;
  onRemoveColumn?: (columnId: string) => void;
  /** Optional indicator for external drops */
  externalDropIndicator?: { columnId: string; index: number } | null;
  /** Optional shared instance id for cross-board drag */
  instanceId?: symbol;
  /** Optional shared registry for cross-board drag */
  registry?: ReturnType<typeof createRegistry>;
  /**
   * When `true` this component is *controlled*:
   *  - It never stores its own copy of the board.
   *  - All mutations are sent to the parent via `onChange`.
   * Defaults to `false` (legacy self-managed behaviour).
   */
  controlled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const DnDBoardMain = <TCard extends BaseCardDnD>({
  columnMap,
  orderedColumnIds,
  CardComponent,
  enableColumnReorder = true,
  onChange,
  onSubmit,
  isLoading = false,
  onRemoveColumn,
  externalDropIndicator = null,
  instanceId: instanceIdProp,
  registry: registryProp,
  controlled = false,
}: DnDBoardMainProps<TCard>) => {
  /* -----------------------------------------------------------------------
   * 1.  Local “last operation” (for accessibility flashes / announcements)
   * --------------------------------------------------------------------- */
  const [lastOperation, setLastOperation] = useState<Operation | null>(null);

  /* -----------------------------------------------------------------------
   * 2.  Uncontrolled mode keeps its own copy of the board
   * --------------------------------------------------------------------- */
  const [internalBoard, setInternalBoard] = useState(() => ({
    columnMap,
    orderedColumnIds,
  }));

  /* Keep internal copy in sync with props while uncontrolled */
  useEffect(() => {
    if (!controlled) {
      setInternalBoard({ columnMap, orderedColumnIds });
    }
  }, [columnMap, orderedColumnIds, controlled]);

  /* Which version of the board should we render? */
  const renderedBoard = controlled
    ? { columnMap, orderedColumnIds }
    : internalBoard;

  /* Full board snapshot including lastOperation (used everywhere) */
  const data: BoardState<TCard> = useMemo(
    () => ({
      columnMap: renderedBoard.columnMap,
      orderedColumnIds: renderedBoard.orderedColumnIds,
      lastOperation,
    }),
    [renderedBoard, lastOperation]
  );

  /* -----------------------------------------------------------------------
   * 3.  Stable ref for callbacks that need the latest board
   * --------------------------------------------------------------------- */
  const stableData = useRef(data);
  useEffect(() => {
    stableData.current = data;
  }, [data]);

  /* Helper returning the current board (no lastOperation) */
  const getBoard = () => ({
    columnMap: stableData.current.columnMap,
    orderedColumnIds: stableData.current.orderedColumnIds,
  });

  /* -----------------------------------------------------------------------
   * 4.  Commit helper: updates internalBoard if necessary + fires onChange
   * --------------------------------------------------------------------- */
  const commit = useCallback(
    (next: BoardState<TCard>) => {
      if (!controlled) {
        setInternalBoard({
          columnMap: next.columnMap,
          orderedColumnIds: next.orderedColumnIds,
        });
      }
      onChange?.(next);
    },
    [controlled, onChange]
  );

  /* -----------------------------------------------------------------------
   * 5.  Create a registry for DOM references
   * --------------------------------------------------------------------- */
  const registry = useRef(registryProp ?? createRegistry()).current;

  /* -----------------------------------------------------------------------
   * 6.  Mutator helpers (reorderColumn, reorderCard, moveCard)
   * --------------------------------------------------------------------- */
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
      const { orderedColumnIds } = getBoard();

      const outcome: Outcome = {
        type: "column-reorder",
        columnId: orderedColumnIds[startIndex],
        startIndex,
        finishIndex,
      };

      const newIds = reorder({
        list: orderedColumnIds,
        startIndex,
        finishIndex,
      });

      const next: BoardState<TCard> = {
        columnMap: getBoard().columnMap,
        orderedColumnIds: newIds,
        lastOperation: { trigger, outcome },
      };

      commit(next);
      setLastOperation({ trigger, outcome });
    },
    [commit]
  );

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
      const { columnMap, orderedColumnIds } = getBoard();
      const sourceColumn = columnMap[columnId];

      const updatedItems = reorder({
        list: sourceColumn.items,
        startIndex,
        finishIndex,
      });

      const updatedMap: ColumnMap<TCard> = {
        ...columnMap,
        [columnId]: { ...sourceColumn, items: updatedItems },
      };

      const outcome: Outcome = {
        type: "card-reorder",
        columnId,
        startIndex,
        finishIndex,
      };

      const next: BoardState<TCard> = {
        columnMap: updatedMap,
        orderedColumnIds,
        lastOperation: { trigger, outcome },
      };

      commit(next);
      setLastOperation({ trigger, outcome });
    },
    [commit]
  );

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
      if (startColumnId === finishColumnId) return;

      const { columnMap: currentMap, orderedColumnIds } = getBoard();

      const sourceColumn = currentMap[startColumnId];
      const destinationColumn = currentMap[finishColumnId];
      const item = sourceColumn.items[itemIndexInStartColumn];

      // If no explicit destination index is provided, default to the end of
      // the destination column. Previously this defaulted to `0`, which caused
      // cards moved between columns to appear at the top rather than where they
      // were dropped.
      const destIdx =
        typeof itemIndexInFinishColumn === "number"
          ? itemIndexInFinishColumn
          : destinationColumn.items.length;
      const destItems = Array.from(destinationColumn.items);
      destItems.splice(destIdx, 0, item);

      const updatedMap: ColumnMap<TCard> = {
        ...currentMap,
        [startColumnId]: {
          ...sourceColumn,
          items: sourceColumn.items.filter((i) => i.id !== item.id),
        },
        [finishColumnId]: {
          ...destinationColumn,
          items: destItems,
        },
      };

      const outcome: Outcome = {
        type: "card-move",
        finishColumnId,
        itemIndexInStartColumn,
        itemIndexInFinishColumn: destIdx,
      };

      const next: BoardState<TCard> = {
        columnMap: updatedMap,
        orderedColumnIds,
        lastOperation: { trigger, outcome },
      };

      commit(next);
      setLastOperation({ trigger, outcome });
    },
    [commit]
  );

  /* -----------------------------------------------------------------------
   * 7.  Unique instance ID for all draggables / droppables in this board
   * --------------------------------------------------------------------- */
  const instanceId = useRef(instanceIdProp ?? Symbol("instance-id")).current;

  /* -----------------------------------------------------------------------
   * 8.  Effect: monitor for elements & handle drop logic
   * --------------------------------------------------------------------- */
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;

          if (!location.current.dropTargets.length) return;

          // Column -> column
          if (source.data.type === "column") {
            const board = getBoard();

            const startIndex = board.orderedColumnIds.findIndex(
              (id) => id === source.data.columnId
            );

            // If the column does not belong to this board, ignore here.
            if (startIndex === -1) {
              return;
            }

            const target = location.current.dropTargets[0];
            const indexOfTarget = board.orderedColumnIds.findIndex(
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
            return;
          }

          // Card -> ???
          if (source.data.type === "card") {
            const board = getBoard();
            const itemId = source.data.itemId as string;

            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceColumnId = startColumnRecord.data.columnId as string;
            const sourceColumn = board.columnMap[sourceColumnId];
            const itemIndex = sourceColumn.items.findIndex(
              (i) => i.id === itemId
            );

            // Dropped directly onto a column
            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = board.columnMap[destinationId];

              if (sourceColumn === destinationColumn) {
                // reorder within same column
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
                // move to end of different column
                moveCard({
                  itemIndexInStartColumn: itemIndex,
                  startColumnId: sourceColumn.columnId,
                  finishColumnId: destinationColumn.columnId,
                  trigger: "pointer",
                });
              }
              return;
            }

            // Dropped onto a card (target card + its column)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = board.columnMap[destinationColumnId];

              const indexOfTarget = destinationColumn.items.findIndex(
                (i) => i.id === destinationCardRecord.data.itemId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                destinationCardRecord.data
              );

              if (sourceColumn === destinationColumn) {
                // reorder within same column
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
                // move to specific index in different column
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
          }
        },
      })
    );
  }, [instanceId, reorderColumn, reorderCard, moveCard]);

  /* -----------------------------------------------------------------------
   * 9.  Effect: flashes and live-region announcements (unchanged)
   * --------------------------------------------------------------------- */
  useEffect(() => {
    if (lastOperation === null) return;

    const { outcome, trigger } = lastOperation;

    // Column reorder
    if (outcome.type === "column-reorder") {
      const { startIndex, finishIndex } = outcome;
      const board = stableData.current;
      const sourceColumn = board.columnMap[board.orderedColumnIds[finishIndex]];
      const entry = registry.getColumn(sourceColumn.columnId);
      triggerPostMoveFlash(entry.element);

      liveRegion.announce(
        `You've moved ${sourceColumn.title} from position ${
          startIndex + 1
        } to position ${finishIndex + 1} of ${board.orderedColumnIds.length}.`
      );
      return;
    }

    // Card reorder
    if (outcome.type === "card-reorder") {
      const { columnId, startIndex, finishIndex } = outcome;
      const board = stableData.current;
      const column = board.columnMap[columnId];
      const item = column.items[finishIndex];
      const entry = registry.getCard(item.id);
      triggerPostMoveFlash(entry.element);

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

    // Card move
    if (outcome.type === "card-move") {
      const {
        finishColumnId,
        itemIndexInStartColumn,
        itemIndexInFinishColumn,
      } = outcome;

      const board = stableData.current;
      const destinationColumn = board.columnMap[finishColumnId];
      const item = destinationColumn.items[itemIndexInFinishColumn];

      const finishPosition =
        typeof itemIndexInFinishColumn === "number"
          ? itemIndexInFinishColumn + 1
          : destinationColumn.items.length;

      const entry = registry.getCard(item.id);
      triggerPostMoveFlash(entry.element);

      if (trigger === "keyboard") {
        liveRegion.announce(
          `You've moved ${item.id} from position ${
            itemIndexInStartColumn + 1
          } to position ${finishPosition} in the ${
            destinationColumn.title
          } column.`
        );
      }
    }
  }, [lastOperation, registry]);

  /* Cleanup live-region on unmount */
  useEffect(() => liveRegion.cleanup, []);

  /* -----------------------------------------------------------------------
   * 10. Memoised context value
   * --------------------------------------------------------------------- */
  const contextValue: BoardContextValue<TCard> = useMemo(
    () => ({
      getColumns: () =>
        renderedBoard.orderedColumnIds.map((id) => renderedBoard.columnMap[id]),
      reorderColumn,
      reorderCard,
      moveCard,
      registerCard: registry.registerCard,
      registerColumn: registry.registerColumn,
      instanceId,
    }),
    [renderedBoard, reorderColumn, reorderCard, moveCard, registry, instanceId]
  );

  /* -----------------------------------------------------------------------
   * 11. Render
   * --------------------------------------------------------------------- */
  return (
    <BoardContext.Provider value={contextValue}>
      <Flex
        flexDirection="column"
        gap={4}
        flex={1}
        justifyContent="space-between"
      >
        <Board>
          {renderedBoard.orderedColumnIds.map((columnId) => (
            <Column
              key={columnId}
              column={renderedBoard.columnMap[columnId]}
              CardComponent={CardComponent}
              enableColumnReorder={enableColumnReorder}
              isLoading={isLoading}
              onRemoveColumn={onRemoveColumn}
              externalDropIndex={
                externalDropIndicator &&
                externalDropIndicator.columnId === columnId
                  ? externalDropIndicator.index
                  : null
              }
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

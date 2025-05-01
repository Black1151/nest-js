// useBoardSequencerDnd.ts

import { useEffect, useCallback } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

import invariant from "tiny-invariant";

import { BaseCardDnD, ColumnType } from "../types";
import { BoardSequencerState, SequencerOutcome } from "./boardSequencerTypes";

/**
 * The arguments our hook needs to perform the DnD logic.
 */
interface UseBoardSequencerDndArgs<TCard extends BaseCardDnD> {
  instanceId: symbol;
  /** A ref to the sequencerData (so we can read board/column state in onDrop) */
  stableSequencerDataRef: React.MutableRefObject<BoardSequencerState<TCard>>;

  /** Setter for updating the sequencerData state */
  setSequencerData: React.Dispatch<
    React.SetStateAction<BoardSequencerState<TCard>>
  >;

  enableBoardReorder: boolean;
  enableColumnCrossBoardMove: boolean;
  enableCardCrossBoardMove: boolean;
}

export function useBoardSequencerDnd<TCard extends BaseCardDnD>({
  instanceId,
  stableSequencerDataRef,
  setSequencerData,
  enableBoardReorder,
  enableColumnCrossBoardMove,
  enableCardCrossBoardMove,
}: UseBoardSequencerDndArgs<TCard>) {
  // ---------------------------------------------------------------------------
  // A) Reorder entire boards (left-to-right)
  // ---------------------------------------------------------------------------
  const reorderBoards = useCallback(
    (
      startIndex: number,
      finishIndex: number,
      trigger: "pointer" | "keyboard"
    ) => {
      if (!enableBoardReorder) return;

      setSequencerData((prev) => {
        const newOrderedIds = [...prev.orderedBoardIds];
        const [removed] = newOrderedIds.splice(startIndex, 1);
        newOrderedIds.splice(finishIndex, 0, removed);

        const outcome: SequencerOutcome = {
          type: "board-reorder",
          boardId: removed,
          startIndex,
          finishIndex,
        };

        return {
          ...prev,
          orderedBoardIds: newOrderedIds,
          lastSequencerOperation: { outcome, trigger },
        };
      });
    },
    [enableBoardReorder, setSequencerData]
  );

  // ---------------------------------------------------------------------------
  // B) Move a column from one board to another
  // ---------------------------------------------------------------------------
  const moveColumnBetweenBoards = useCallback(
    (
      sourceBoardId: string,
      finishBoardId: string,
      columnId: string,
      trigger: "pointer" | "keyboard"
    ) => {
      if (!enableColumnCrossBoardMove) return;

      setSequencerData((prev) => {
        const { boardMap } = prev;
        const sourceBoardData = boardMap[sourceBoardId];
        const finishBoardData = boardMap[finishBoardId];
        if (!sourceBoardData || !finishBoardData) return prev;

        // Remove the column from source board
        const { columnMap: sourceColMap, orderedColumnIds: sourceOrder } =
          sourceBoardData.boardState;
        const columnToMove = sourceColMap[columnId];
        if (!columnToMove) {
          console.warn(
            `Cannot find column '${columnId}' in board '${sourceBoardId}'`
          );
          return prev;
        }

        const newSourceOrder = sourceOrder.filter(
          (colId) => colId !== columnId
        );
        const { [columnId]: removedCol, ...newSourceColMap } = sourceColMap;

        // Insert the column into the finish board
        const { columnMap: finishColMap, orderedColumnIds: finishOrder } =
          finishBoardData.boardState;
        const newFinishOrder = [...finishOrder, columnId];
        const newFinishColMap = {
          ...finishColMap,
          [columnId]: removedCol,
        };

        // Build updated board states
        const updatedSourceBoard = {
          ...sourceBoardData,
          boardState: {
            ...sourceBoardData.boardState,
            columnMap: newSourceColMap,
            orderedColumnIds: newSourceOrder,
            lastOperation: null,
          },
        };
        const updatedFinishBoard = {
          ...finishBoardData,
          boardState: {
            ...finishBoardData.boardState,
            columnMap: newFinishColMap,
            orderedColumnIds: newFinishOrder,
            lastOperation: null,
          },
        };

        const newBoardMap = {
          ...boardMap,
          [sourceBoardId]: updatedSourceBoard,
          [finishBoardId]: updatedFinishBoard,
        };

        const outcome: SequencerOutcome = {
          type: "column-move-between-boards",
          sourceBoardId,
          finishBoardId,
          columnId,
        };

        return {
          ...prev,
          boardMap: newBoardMap,
          lastSequencerOperation: { outcome, trigger },
        };
      });
    },
    [enableColumnCrossBoardMove, setSequencerData]
  );

  // ---------------------------------------------------------------------------
  // C) Move a card from one board/column to another board/column
  // ---------------------------------------------------------------------------
  const moveCardBetweenBoards = useCallback(
    (
      sourceBoardId: string,
      finishBoardId: string,
      sourceColumnId: string,
      finishColumnId: string,
      itemId: string,
      trigger: "pointer" | "keyboard"
    ) => {
      if (!enableCardCrossBoardMove) return;

      setSequencerData((prev) => {
        const { boardMap } = prev;
        const sourceBoardData = boardMap[sourceBoardId];
        const finishBoardData = boardMap[finishBoardId];
        if (!sourceBoardData || !finishBoardData) return prev;

        // Remove item from source column
        const sourceColumn =
          sourceBoardData.boardState.columnMap[sourceColumnId];
        if (!sourceColumn) {
          console.warn(
            `Source column '${sourceColumnId}' not found in board '${sourceBoardId}'`
          );
          return prev;
        }
        const itemIndex = sourceColumn.items.findIndex(
          (it) => it.id === itemId
        );
        if (itemIndex < 0) {
          console.warn(
            `Item '${itemId}' not found in column '${sourceColumnId}'`
          );
          return prev;
        }
        const [removedItem] = sourceColumn.items.splice(itemIndex, 1);

        // Add item to finish column
        const finishColumn =
          finishBoardData.boardState.columnMap[finishColumnId];
        if (!finishColumn) {
          console.warn(
            `Finish column '${finishColumnId}' not found in board '${finishBoardId}'`
          );
          return prev;
        }
        finishColumn.items.push(removedItem);

        // Build updated column objects
        const updatedSourceColumn: ColumnType<TCard> = {
          ...sourceColumn,
          items: [...sourceColumn.items],
        };
        const updatedFinishColumn: ColumnType<TCard> = {
          ...finishColumn,
          items: [...finishColumn.items],
        };

        // Update the board states
        const updatedSourceBoard = {
          ...sourceBoardData,
          boardState: {
            ...sourceBoardData.boardState,
            columnMap: {
              ...sourceBoardData.boardState.columnMap,
              [sourceColumnId]: updatedSourceColumn,
            },
            lastOperation: null,
          },
        };
        const updatedFinishBoard = {
          ...finishBoardData,
          boardState: {
            ...finishBoardData.boardState,
            columnMap: {
              ...finishBoardData.boardState.columnMap,
              [finishColumnId]: updatedFinishColumn,
            },
            lastOperation: null,
          },
        };

        const newBoardMap = {
          ...boardMap,
          [sourceBoardId]: updatedSourceBoard,
          [finishBoardId]: updatedFinishBoard,
        };

        const outcome: SequencerOutcome = {
          type: "card-move-between-boards",
          sourceBoardId,
          finishBoardId,
          sourceColumnId,
          finishColumnId,
          itemId,
        };

        return {
          ...prev,
          boardMap: newBoardMap,
          lastSequencerOperation: { outcome, trigger },
        };
      });
    },
    [enableCardCrossBoardMove, setSequencerData]
  );

  // // ---------------------------------------------------------------------------
  // // D) onDrop effect for cross-board logic or board reordering
  // // ---------------------------------------------------------------------------
  // useEffect(() => {
  //   // This parent-level monitor handles:
  //   // - Drags of type "board" for reordering boards
  //   // - Columns or cards that cross from one board to another
  //   // - If the drop remains in the same board, the child's DnDBoardMain will handle it.
  //   return combine(
  //     monitorForElements({
  //       canMonitor({ source }) {
  //         // Must match the top-level instanceId
  //         return source.data.instanceId === instanceId;
  //       },
  //       onDrop(args) {
  //         const { source, location } = args;
  //         if (!location.current.dropTargets.length) {
  //           return;
  //         }

  //         const sourceBoardId = source.data.boardId;
  //         invariant(typeof sourceBoardId === "string");

  //         // A) Board reorder
  //         if (source.data.type === "board") {
  //           if (!enableBoardReorder) return;
  //           const { orderedBoardIds } = stableSequencerDataRef.current;

  //           const startIndex = orderedBoardIds.findIndex(
  //             (id) => id === sourceBoardId
  //           );
  //           if (startIndex < 0) return;

  //           const target = location.current.dropTargets[0];
  //           const finishBoardId = target.data.boardId;
  //           invariant(typeof finishBoardId === "string");

  //           const finishIndex = orderedBoardIds.findIndex(
  //             (id) => id === finishBoardId
  //           );

  //           // For horizontal reorder, find the closest edge
  //           const closestEdge: Edge | null = extractClosestEdge(target.data);
  //           const actualFinishIndex = getReorderDestinationIndex({
  //             startIndex,
  //             indexOfTarget: finishIndex,
  //             closestEdgeOfTarget: closestEdge,
  //             axis: "horizontal",
  //           });

  //           reorderBoards(startIndex, actualFinishIndex, "pointer");
  //           return;
  //         }

  //         // B) Column move across boards
  //         if (source.data.type === "column") {
  //           if (!enableColumnCrossBoardMove) return;
  //           const target = location.current.dropTargets[0];
  //           const finishBoardId = target.data.boardId as string;
  //           if (!finishBoardId) return;
  //           if (finishBoardId === sourceBoardId) {
  //             // same board => child's local logic
  //             return;
  //           }
  //           const columnId = source.data.columnId;
  //           invariant(typeof columnId === "string");

  //           moveColumnBetweenBoards(
  //             sourceBoardId,
  //             finishBoardId,
  //             columnId,
  //             "pointer"
  //           );
  //           return;
  //         }

  //         // C) Card move across boards
  //         if (source.data.type === "card") {
  //           if (!enableCardCrossBoardMove) return;

  //           const dropTargets = location.current.dropTargets;
  //           if (dropTargets.length === 0) return;

  //           // Typically the last dropTarget is the column or card
  //           const finalTarget = dropTargets[dropTargets.length - 1];
  //           const finishBoardId = finalTarget.data.boardId as string;
  //           if (finishBoardId === sourceBoardId) {
  //             // same board => child's local logic
  //             return;
  //           }

  //           const itemId = source.data.itemId;
  //           invariant(typeof itemId === "string");

  //           // We also need the sourceColumnId from initial dropTargets
  //           const initialTargets = location.initial.dropTargets;
  //           if (initialTargets.length < 2) {
  //             console.warn(
  //               "Could not detect source column in initial dropTargets"
  //             );
  //             return;
  //           }
  //           const sourceColumnRecord = initialTargets[1];
  //           const sourceColumnId = sourceColumnRecord.data.columnId;
  //           invariant(typeof sourceColumnId === "string");

  //           // The finalTarget should provide the finishColumnId
  //           const finishColumnId = finalTarget.data.columnId;
  //           invariant(typeof finishColumnId === "string");

  //           moveCardBetweenBoards(
  //             sourceBoardId,
  //             finishBoardId,
  //             sourceColumnId,
  //             finishColumnId,
  //             itemId,
  //             "pointer"
  //           );
  //         }
  //       },
  //     })
  //   );
  // }, [
  //   instanceId,
  //   stableSequencerDataRef,
  //   enableBoardReorder,
  //   enableColumnCrossBoardMove,
  //   enableCardCrossBoardMove,
  //   reorderBoards,
  //   moveColumnBetweenBoards,
  //   moveCardBetweenBoards,
  // ]);

  // Expose whichever methods are useful for the parent
  return {
    reorderBoards,
    moveColumnBetweenBoards,
    moveCardBetweenBoards,
  };
}

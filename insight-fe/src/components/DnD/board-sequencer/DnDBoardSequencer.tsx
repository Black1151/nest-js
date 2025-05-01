"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Flex, Button } from "@chakra-ui/react";

// These imports are needed to handle parent-level cross-board logic:
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

import { BoardSequencerState } from "./boardSequencerTypes";
import { BaseCardDnD } from "../types";
import { DnDBoardMain } from "../DnDBoardMain";

// Import your custom hook:
import { useBoardSequencerDnd } from "./useBoardSequencerDnd";

export function BoardSequencer<TCard extends BaseCardDnD>({
  boardMap,
  orderedBoardIds,
  onSubmitAllBoards,
  CardComponent,
  isLoading = false,
  enableBoardReorder = true,
  enableColumnCrossBoardMove = true,
  enableCardCrossBoardMove = true,
}: {
  boardMap: BoardSequencerState<TCard>["boardMap"];
  orderedBoardIds: string[];
  onSubmitAllBoards?: (sequencerData: BoardSequencerState<TCard>) => void;
  CardComponent: React.ComponentType<{ item: TCard }>;
  isLoading?: boolean;
  enableBoardReorder?: boolean;
  enableColumnCrossBoardMove?: boolean;
  enableCardCrossBoardMove?: boolean;
}) {
  // --------------------------------------------------------
  // Local state for the entire multi-board
  // --------------------------------------------------------
  const [sequencerData, setSequencerData] = useState<
    BoardSequencerState<TCard>
  >({
    boardMap,
    orderedBoardIds,
    lastSequencerOperation: null,
  });

  // If parent props change, reset local state
  useEffect(() => {
    setSequencerData({
      boardMap,
      orderedBoardIds,
      lastSequencerOperation: null,
    });
  }, [boardMap, orderedBoardIds]);

  // Keep a ref to always read the latest sequencerData in the onDrop effect
  const stableSequencerData = useRef(sequencerData);
  useEffect(() => {
    stableSequencerData.current = sequencerData;
  }, [sequencerData]);

  // A unique instanceId for DnD events
  const [instanceId] = useState(() => Symbol("board-sequencer-instance-id"));

  // --------------------------------------------------------
  // Use the custom hook for all DnD logic:
  // board reorder + cross-board moves
  // --------------------------------------------------------
  const { reorderBoards, moveColumnBetweenBoards, moveCardBetweenBoards } =
    useBoardSequencerDnd<TCard>({
      instanceId,
      stableSequencerDataRef: stableSequencerData,
      setSequencerData,
      enableBoardReorder,
      enableColumnCrossBoardMove,
      enableCardCrossBoardMove,
    });

  // --------------------------------------------------------
  // Parent-level DnD monitor to handle cross-board or board-level drag
  // --------------------------------------------------------
  useEffect(() => {
    /**
     * This effect sets up a monitor for cross‑board logic or entire board reordering.
     * - If the drag stays within the same board, DnDBoardMain handles it locally.
     * - If the drag crosses boards, we call the relevant function from our hook.
     */
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          // Only monitor elements using this instanceId
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { source, location } = args;
          const { dropTargets } = location.current;
          if (!dropTargets.length) return;

          const sourceBoardId = source.data.boardId;
          invariant(typeof sourceBoardId === "string");

          // --- A) Reorder entire boards (dragging a board container) ---
          if (source.data.type === "board") {
            if (!enableBoardReorder) return;

            const { orderedBoardIds } = stableSequencerData.current;
            const startIndex = orderedBoardIds.findIndex(
              (id) => id === sourceBoardId
            );
            if (startIndex < 0) return;

            // The first drop target is presumably the board we hovered.
            const target = dropTargets[0];
            const finishBoardId = target.data.boardId;
            invariant(typeof finishBoardId === "string");

            const finishIndex = orderedBoardIds.findIndex(
              (id) => id === finishBoardId
            );

            // Determine if it's going left or right using the closest edge:
            const closestEdge: Edge | null = extractClosestEdge(target.data);
            const actualFinishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget: finishIndex,
              closestEdgeOfTarget: closestEdge,
              axis: "horizontal",
            });

            reorderBoards(startIndex, actualFinishIndex, "pointer");
            return;
          }

          // --- B) Move a column across boards ---
          if (source.data.type === "column") {
            if (!enableColumnCrossBoardMove) return;

            const target = dropTargets[0];
            const finishBoardId = target.data.boardId as string;
            if (!finishBoardId || finishBoardId === sourceBoardId) {
              // If same board, local board logic handles it
              return;
            }

            const columnId = source.data.columnId;
            invariant(typeof columnId === "string");

            moveColumnBetweenBoards(
              sourceBoardId,
              finishBoardId,
              columnId,
              "pointer"
            );
            return;
          }

          // --- C) Move a card across boards ---
          if (source.data.type === "card") {
            if (!enableCardCrossBoardMove) return;

            // If the drop is within the same board, local logic handles it
            const finalTarget = dropTargets[dropTargets.length - 1];
            const finishBoardId = finalTarget.data.boardId as string;
            if (!finishBoardId || finishBoardId === sourceBoardId) {
              return;
            }

            const itemId = source.data.itemId;
            invariant(typeof itemId === "string");

            // We also need to find the source column ID from the initial drop:
            const initialTargets = location.initial.dropTargets;
            if (initialTargets.length < 2) {
              console.warn(
                "Could not detect source column in initial dropTargets"
              );
              return;
            }
            const sourceColumnRecord = initialTargets[1];
            const sourceColumnId = sourceColumnRecord.data.columnId;
            invariant(typeof sourceColumnId === "string");

            // The final target for the card presumably indicates the finish column:
            const finishColumnId = finalTarget.data.columnId;
            invariant(typeof finishColumnId === "string");

            moveCardBetweenBoards(
              sourceBoardId,
              finishBoardId,
              sourceColumnId,
              finishColumnId,
              itemId,
              "pointer"
            );
          }
        },
      })
    );
  }, [
    instanceId,
    reorderBoards,
    moveColumnBetweenBoards,
    moveCardBetweenBoards,
    enableBoardReorder,
    enableColumnCrossBoardMove,
    enableCardCrossBoardMove,
  ]);

  // --------------------------------------------------------
  // Render each board side by side
  // --------------------------------------------------------
  const renderBoards = useMemo(() => {
    const { orderedBoardIds, boardMap } = sequencerData;
    return orderedBoardIds.map((boardId) => {
      const boardData = boardMap[boardId];

      console.log("boardData", boardData);
      console.log("boardId", boardId);
      console.log("instanceId", instanceId);
      console.log("sequencerData", sequencerData);

      if (!boardData) return null;

      return (
        <DnDBoardMain
          key={boardData.boardId}
          boardId={boardData.boardId}
          providedInstanceId={instanceId}
          columnMap={boardData.boardState.columnMap}
          orderedColumnIds={boardData.boardState.orderedColumnIds}
          CardComponent={CardComponent}
          isLoading={isLoading}
          enableColumnReorder={true} // local board can reorder columns
          onSubmit={undefined}
        />
      );
    });
  }, [sequencerData, CardComponent, isLoading, instanceId]);

  // --------------------------------------------------------
  // Optional: Single "Submit All" for the entire multi-board
  // --------------------------------------------------------
  const handleSubmitAll = useCallback(() => {
    if (onSubmitAllBoards) {
      onSubmitAllBoards(sequencerData);
    }
  }, [onSubmitAllBoards, sequencerData]);

  // --------------------------------------------------------
  // Return the UI
  // --------------------------------------------------------
  return (
    <Flex direction="column" gap={4} w="100%">
      <Flex direction="row" gap={4} w="100%" overflowX="auto">
        {renderBoards}
      </Flex>

      {onSubmitAllBoards && (
        <Button
          onClick={handleSubmitAll}
          colorScheme="orange"
          isLoading={isLoading}
        >
          Submit All Boards
        </Button>
      )}
    </Flex>
  );
}

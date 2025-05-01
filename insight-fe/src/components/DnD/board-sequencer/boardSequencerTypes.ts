// boardSequencerTypes.ts

import { BaseCardDnD } from "../types";
import { BoardState } from "../DnDBoardMain";

/**
 * BoardData holds:
 *   boardId (unique)
 *   boardState (the local state that DnDBoardMain needs): { columnMap, orderedColumnIds, lastOperation }
 */
export type BoardData<TCard extends BaseCardDnD> = {
  boardId: string;
  boardState: BoardState<TCard>;
};

/**
 * A map of boardId -> BoardData
 */
export type BoardMap<TCard extends BaseCardDnD> = {
  [boardId: string]: BoardData<TCard>;
};

/**
 * Possible outcomes for cross-board or board-level reordering.
 */
export type SequencerOutcome =
  | {
      type: "board-reorder";
      boardId: string; // the board that was moved
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "column-move-between-boards";
      sourceBoardId: string;
      finishBoardId: string;
      columnId: string;
    }
  | {
      type: "card-move-between-boards";
      sourceBoardId: string;
      finishBoardId: string;
      sourceColumnId: string;
      finishColumnId: string;
      itemId: string;
    };

export type SequencerOperation = {
  outcome: SequencerOutcome;
  trigger: "pointer" | "keyboard";
};

/**
 * Overall state for the board sequencer:
 *   - boardMap
 *   - orderedBoardIds
 *   - lastSequencerOperation
 */
export interface BoardSequencerState<TCard extends BaseCardDnD> {
  boardMap: BoardMap<TCard>;
  orderedBoardIds: string[];
  lastSequencerOperation: SequencerOperation | null;
}

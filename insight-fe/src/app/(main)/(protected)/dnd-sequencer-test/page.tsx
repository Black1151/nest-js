"use client";

import {
  BoardData,
  BoardMap,
  BoardSequencerState,
} from "@/components/DnD/board-sequencer/boardSequencerTypes";
import { BoardSequencer } from "@/components/DnD/board-sequencer/DnDBoardSequencer";
import React, { useCallback } from "react";
import { ExampleCard, ExampleCardComponent } from "./ExampleCard";

// 1) Build the mock data for each board.
//    Each board must have: boardId, and boardState (columnMap, orderedColumnIds, lastOperation)
const boardA: BoardData<ExampleCard> = {
  boardId: "boardA",
  boardState: {
    columnMap: {
      todo: {
        title: "To Do",
        columnId: "todo",
        items: [
          { id: "item1", title: "Task 1" },
          { id: "item2", title: "Task 2" },
        ],
      },
      done: {
        title: "Done",
        columnId: "done",
        items: [{ id: "item3", title: "Task 3" }],
      },
    },
    orderedColumnIds: ["todo", "done"],
    lastOperation: null,
  },
};

const boardB: BoardData<ExampleCard> = {
  boardId: "boardB",
  boardState: {
    columnMap: {
      backlog: {
        title: "Backlog",
        columnId: "backlog",
        items: [
          { id: "item4", title: "Feature A" },
          { id: "item5", title: "Feature B" },
        ],
      },
      progress: {
        title: "In Progress",
        columnId: "progress",
        items: [{ id: "item6", title: "Fix Bug #42" }],
      },
    },
    orderedColumnIds: ["backlog", "progress"],
    lastOperation: null,
  },
};

const boardC: BoardData<ExampleCard> = {
  boardId: "boardC",
  boardState: {
    columnMap: {
      ideas: {
        title: "Ideas",
        columnId: "ideas",
        items: [
          { id: "item7", title: "New Marketing Plan" },
          { id: "item8", title: "Website Redesign" },
        ],
      },
    },
    orderedColumnIds: ["ideas"],
    lastOperation: null,
  },
};

// 2) Create the BoardMap (object with each board keyed by boardId)
const boardMap: BoardMap<ExampleCard> = {
  boardA,
  boardB,
  boardC,
};

// 3) The order in which boards will appear (left to right)
const orderedBoardIds = ["boardA", "boardB", "boardC"];

export default function ExampleBoardSequencer() {
  // Optional: onSubmitAllBoards handler (you can omit if not needed)
  const handleSubmitAll = useCallback(
    (sequencerData: BoardSequencerState<ExampleCard>) => {
      // For example, just log out the entire structure
      console.log("All boards submitted. Current state:", sequencerData);
      alert("Submitted all boards to console!");
    },
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Example of BoardSequencer with Three Boards</h2>

      <BoardSequencer<ExampleCard>
        boardMap={boardMap}
        orderedBoardIds={orderedBoardIds}
        onSubmitAllBoards={handleSubmitAll}
        CardComponent={ExampleCardComponent}
        isLoading={false}
        enableBoardReorder={true}
        enableColumnCrossBoardMove={true}
        enableCardCrossBoardMove={true}
      />
    </div>
  );
}

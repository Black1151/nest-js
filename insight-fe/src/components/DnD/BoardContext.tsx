// BoardContext.ts
import React, { createContext, useContext, ReactNode } from "react";
import invariant from "tiny-invariant";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";
import { BaseCardDnD, ColumnType } from "./types";

// The shape of data we want to store in context
export type BoardContextValue<TCard extends BaseCardDnD> = {
  getColumns: () => ColumnType<TCard>[];

  reorderColumn: (args: { startIndex: number; finishIndex: number }) => void;

  reorderCard: (args: {
    columnId: string;
    startIndex: number;
    finishIndex: number;
  }) => void;

  moveCard: (args: {
    startColumnId: string;
    finishColumnId: string;
    itemIndexInStartColumn: number;
    itemIndexInFinishColumn?: number;
  }) => void;

  registerCard: (args: {
    cardId: string;
    entry: { element: HTMLElement };
  }) => CleanupFn;

  registerColumn: (args: {
    columnId: string;
    entry: { element: HTMLElement };
  }) => CleanupFn;

  instanceId: symbol;
};

// We allow the context to store any TCard that extends BaseCardDnD
export const BoardContext = createContext<BoardContextValue<any> | null>(null);

// For convenience, define a provider component
interface BoardContextProviderProps<TCard extends BaseCardDnD> {
  value: BoardContextValue<TCard>;
  children: ReactNode;
}

export function BoardContextProvider<TCard extends BaseCardDnD>({
  value,
  children,
}: BoardContextProviderProps<TCard>) {
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

// A generic hook so consumers can retrieve the typed BoardContextValue
export function useBoardContext<
  TCard extends BaseCardDnD
>(): BoardContextValue<TCard> {
  const value = useContext(BoardContext);
  invariant(value, "cannot find BoardContext provider");
  return value as BoardContextValue<TCard>;
}

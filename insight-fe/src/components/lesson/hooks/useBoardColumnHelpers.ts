"use client";

import { useCallback } from "react";
import { BoardRow } from "../SlideElementsContainer";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import type { LessonState, Action } from "./useLessonSelection";

export default function useBoardColumnHelpers(
  state: LessonState,
  dispatch: React.Dispatch<Action>
) {
  const updateElement = useCallback(
    (updated: SlideElementDnDItemProps) => {
      if (!state.selectedSlideId) return;
      dispatch({
        type: "updateSlide",
        slideId: state.selectedSlideId,
        updater: (slide) => {
          const newMap = { ...slide.columnMap } as typeof slide.columnMap;
          for (const board of slide.boards) {
            for (const colId of board.orderedColumnIds) {
              const col = newMap[colId];
              const idx = col.items.findIndex((i) => i.id === updated.id);
              if (idx !== -1) {
                newMap[colId] = {
                  ...col,
                  items: [
                    ...col.items.slice(0, idx),
                    updated,
                    ...col.items.slice(idx + 1),
                  ],
                };
                break;
              }
            }
          }
          return { ...slide, columnMap: newMap };
        },
      });
    },
    [state.selectedSlideId, dispatch]
  );

  const updateColumn = useCallback(
    (updated: ColumnType<SlideElementDnDItemProps>) => {
      if (!state.selectedSlideId) return;
      dispatch({
        type: "updateSlide",
        slideId: state.selectedSlideId,
        updater: (slide) => ({
          ...slide,
          columnMap: { ...slide.columnMap, [updated.columnId]: updated },
        }),
      });
    },
    [state.selectedSlideId, dispatch]
  );

  const updateBoard = useCallback(
    (updated: BoardRow) => {
      if (!state.selectedSlideId) return;
      dispatch({
        type: "updateBoard",
        slideId: state.selectedSlideId,
        boardId: updated.id,
        updater: () => updated,
      });
    },
    [state.selectedSlideId, dispatch]
  );

  const cloneElement = useCallback(() => {
    if (!state.selectedSlideId || !state.selectedElementId) return;
    dispatch({
      type: "updateSlide",
      slideId: state.selectedSlideId,
      updater: (slide) => {
        const newMap = { ...slide.columnMap } as typeof slide.columnMap;
        for (const board of slide.boards) {
          for (const colId of board.orderedColumnIds) {
            const col = newMap[colId];
            const idx = col.items.findIndex((i) => i.id === state.selectedElementId);
            if (idx !== -1) {
              const orig = col.items[idx];
              const copy = { ...orig, id: crypto.randomUUID() };
              newMap[colId] = {
                ...col,
                items: [
                  ...col.items.slice(0, idx + 1),
                  copy,
                  ...col.items.slice(idx + 1),
                ],
              };
              return { ...slide, columnMap: newMap };
            }
          }
        }
        return slide;
      },
    });
  }, [state.selectedSlideId, state.selectedElementId, dispatch]);

  const deleteElement = useCallback(() => {
    if (!state.selectedSlideId || !state.selectedElementId) return;
    dispatch({
      type: "updateSlide",
      slideId: state.selectedSlideId,
      updater: (slide) => {
        const newMap = { ...slide.columnMap } as typeof slide.columnMap;
        for (const board of slide.boards) {
          for (const colId of board.orderedColumnIds) {
            const col = newMap[colId];
            const idx = col.items.findIndex((i) => i.id === state.selectedElementId);
            if (idx !== -1) {
              newMap[colId] = {
                ...col,
                items: [
                  ...col.items.slice(0, idx),
                  ...col.items.slice(idx + 1),
                ],
              };
              return { ...slide, columnMap: newMap };
            }
          }
        }
        return slide;
      },
    });
    dispatch({ type: "selectElement", id: null });
  }, [state.selectedSlideId, state.selectedElementId, dispatch]);

  return {
    updateElement,
    updateColumn,
    updateBoard,
    cloneElement,
    deleteElement,
  };
}

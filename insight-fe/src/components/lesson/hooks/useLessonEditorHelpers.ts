"use client";

import { useCallback } from "react";
import { Slide } from "../SlideSequencer";
import { BoardRow } from "../SlideElementsContainer";
import {
  SlideElementDnDItemProps,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import { availableFonts } from "@/theme/fonts";

import type { LessonState, Action } from "./useLessonEditorState";

export function useLessonEditorHelpers(
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

  const handleDropElement = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const raw = e.dataTransfer.getData("text/plain");
      let type = raw;
      let config: SlideElementDnDItemProps | null = null;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          type = parsed.type;
          config = parsed.config as SlideElementDnDItemProps;
        }
      } catch {
        /* ignore */
      }
      if (!state.selectedSlideId) return;
      if (!type) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
      const dropColumnId = columnEl?.dataset.columnId;

      dispatch({
        type: "updateSlide",
        slideId: state.selectedSlideId,
        updater: (s) => {
          const newEl: SlideElementDnDItemProps = config
            ? { ...config, id: crypto.randomUUID() }
            : {
                id: crypto.randomUUID(),
                type,
                ...(type === "text"
                  ? {
                      text: "Sample Text",
                      styles: {
                        color: "#000000",
                        fontSize: "16px",
                        fontFamily: availableFonts[0].fontFamily,
                        fontWeight: "normal",
                        lineHeight: "1.2",
                        textAlign: "left",
                      },
                    }
                  : type === "image"
                  ? { src: "https://via.placeholder.com/150" }
                  : type === "video"
                  ? { url: "" }
                  : type === "quiz"
                  ? {
                      title: "Untitled Quiz",
                      description: "",
                      questions: [],
                    }
                  : {}),
                wrapperStyles: {
                  bgColor: "#ffffff",
                  bgOpacity: 0,
                  gradientFrom: "",
                  gradientTo: "",
                  gradientDirection: 0,
                  dropShadow: "none",
                  paddingX: 0,
                  paddingY: 0,
                  marginX: 0,
                  marginY: 0,
                  borderColor: "#000000",
                  borderWidth: 0,
                  borderRadius: "none",
                },
                animation: undefined,
              };

          const firstColumn = s.boards[0].orderedColumnIds[0];
          const columnId =
            dropColumnId && s.columnMap[dropColumnId]
              ? dropColumnId
              : firstColumn;
          const column = s.columnMap[columnId];

          let insertIndex = column.items.length;
          if (columnEl) {
            const cards = Array.from(
              columnEl.querySelectorAll("[data-card-id]")
            ) as HTMLElement[];
            for (let i = 0; i < cards.length; i++) {
              const rect = cards[i].getBoundingClientRect();
              if (e.clientY < rect.top + rect.height / 2) {
                insertIndex = i;
                break;
              }
            }
          }

          const updatedColumn = {
            ...column,
            items: [
              ...column.items.slice(0, insertIndex),
              newEl,
              ...column.items.slice(insertIndex),
            ],
          };

          return {
            ...s,
            columnMap: { ...s.columnMap, [columnId]: updatedColumn },
          };
        },
      });
      dispatch({ type: "setDropIndicator", indicator: null });
    },
    [state.selectedSlideId, dispatch]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      if (!state.selectedSlideId || !type) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
      const dropColumnId = columnEl?.dataset.columnId;
      if (!dropColumnId) {
        dispatch({ type: "setDropIndicator", indicator: null });
        return;
      }

      const slide = state.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;
      const column = slide.columnMap[dropColumnId];
      if (!column) return;

      let insertIndex = column.items.length;
      if (columnEl) {
        const cards = Array.from(
          columnEl.querySelectorAll("[data-card-id]")
        ) as HTMLElement[];
        for (let i = 0; i < cards.length; i++) {
          const rect = cards[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            insertIndex = i;
            break;
          }
        }
      }

      dispatch({
        type: "setDropIndicator",
        indicator: { columnId: dropColumnId, index: insertIndex },
      });
    },
    [state.selectedSlideId, state.slides, dispatch]
  );

  return {
    updateElement,
    updateColumn,
    updateBoard,
    cloneElement,
    deleteElement,
    handleDropElement,
    handleDragOver,
  };
}


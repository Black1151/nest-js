"use client";

import { useCallback } from "react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { availableFonts } from "@/theme/fonts";
import { defaultColumnWrapperStyles } from "../defaultStyles";
import type { LessonState, Action } from "./useLessonSelection";

interface Options {
  defaultColorToken: string;
  defaultFontFamily: string;
}

export default function useDnDHandlers(
  state: LessonState,
  dispatch: React.Dispatch<Action>,
  options: Options
) {
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
            ? { ...config, id: crypto.randomUUID(), styleId: config.styleId }
            : {
                id: crypto.randomUUID(),
                type,
                ...(type === "text"
                  ? {
                      text: "Sample Text",
                      styles: {
                        colorToken: options.defaultColorToken,
                        fontSize: "16px",
                        fontFamily: options.defaultFontFamily,
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
                    ? { title: "Untitled Quiz", description: "", questions: [] }
                  : type === "table"
                    ? {
                        table: {
                          rows: 2,
                          cols: 2,
                          cells: Array.from({ length: 2 }, () =>
                            Array.from({ length: 2 }, () => ({
                              text: "Cell",
                              styles: {
                                colorToken: options.defaultColorToken,
                                fontSize: "14px",
                                fontFamily: options.defaultFontFamily,
                                fontWeight: "normal",
                                lineHeight: "1.2",
                                textAlign: "left",
                              },
                            }))
                          ),
                        },
                      }
                  : {}),
                wrapperStyles: { ...defaultColumnWrapperStyles },
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
    [state.selectedSlideId, dispatch, options.defaultFontFamily]
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

  return { handleDropElement, handleDragOver };
}

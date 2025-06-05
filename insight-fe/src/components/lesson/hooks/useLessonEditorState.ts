"use client";

import {
  useCallback,
  useReducer,
  useMemo,
  useImperativeHandle,
} from "react";
import { Slide, createInitialBoard } from "../SlideSequencer";
import { BoardRow } from "../SlideElementsContainer";
import {
  SlideElementDnDItemProps,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import { availableFonts } from "@/theme/fonts";
import { defaultColumnWrapperStyles } from "../defaultStyles";

export interface LessonEditorHandle {
  getContent: () => { slides: Slide[] };
  setContent: (slides: Slide[]) => void;
}

interface LessonState {
  slides: Slide[];
  selectedSlideId: string | null;
  selectedElementId: string | null;
  selectedColumnId: string | null;
  selectedBoardId: string | null;
  dropIndicator: { columnId: string; index: number } | null;
}

type Action =
  | { type: "setSlides"; updater: React.SetStateAction<Slide[]> }
  | { type: "selectSlide"; id: string | null }
  | { type: "selectElement"; id: string | null }
  | { type: "selectColumn"; id: string | null }
  | { type: "selectBoard"; id: string | null }
  | { type: "setDropIndicator"; indicator: { columnId: string; index: number } | null }
  | { type: "updateSlide"; slideId: string; updater: (slide: Slide) => Slide }
  | {
      type: "updateBoard";
      slideId: string;
      boardId: string;
      updater: (board: BoardRow) => BoardRow;
    };

function reducer(state: LessonState, action: Action): LessonState {
  switch (action.type) {
    case "setSlides": {
      const slides =
        typeof action.updater === "function"
          ? (action.updater as (prev: Slide[]) => Slide[])(state.slides)
          : action.updater;
      return { ...state, slides };
    }
    case "selectSlide":
      return {
        ...state,
        selectedSlideId: action.id,
        selectedElementId: null,
        selectedColumnId: null,
        selectedBoardId: null,
      };
    case "selectElement":
      return {
        ...state,
        selectedElementId: action.id,
        selectedColumnId: null,
        selectedBoardId: null,
      };
    case "selectColumn":
      return {
        ...state,
        selectedColumnId: action.id,
        selectedElementId: null,
        selectedBoardId: null,
      };
    case "selectBoard":
      return {
        ...state,
        selectedBoardId: action.id,
        selectedColumnId: null,
        selectedElementId: null,
      };
    case "setDropIndicator":
      return { ...state, dropIndicator: action.indicator };
    case "updateSlide":
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId ? action.updater(s) : s
        ),
      };
    case "updateBoard":
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId
            ? {
                ...s,
                boards: s.boards.map((b) =>
                  b.id === action.boardId ? action.updater(b) : b
                ),
              }
            : s
        ),
      };
    default:
      return state;
  }
}

export function useLessonEditorState(ref?: React.Ref<LessonEditorHandle>) {
  const initialSlide = {
    id: crypto.randomUUID(),
    title: "Slide 1",
    ...createInitialBoard(),
  };
  const [state, dispatch] = useReducer(reducer, {
    slides: [initialSlide],
    selectedSlideId: initialSlide.id,
    selectedElementId: null,
    selectedColumnId: null,
    selectedBoardId: null,
    dropIndicator: null,
  });

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => ({ slides: state.slides }),
      setContent: (slides: Slide[]) => {
        dispatch({ type: "setSlides", updater: slides });
        dispatch({ type: "selectSlide", id: slides[0]?.id ?? null });
      },
    }),
    [state.slides, dispatch]
  );

  const setSlides = useCallback(
    (updater: React.SetStateAction<Slide[]>) =>
      dispatch({ type: "setSlides", updater }),
    [dispatch]
  );

  const selectSlide = useCallback((id: string | null) => dispatch({ type: "selectSlide", id }), [dispatch]);
  const selectElement = useCallback((id: string | null) => dispatch({ type: "selectElement", id }), [dispatch]);
  const selectColumn = useCallback((id: string | null) => dispatch({ type: "selectColumn", id }), [dispatch]);
  const selectBoard = useCallback((id: string | null) => dispatch({ type: "selectBoard", id }), [dispatch]);

  const selectedSlide = useMemo(
    () => state.slides.find((s) => s.id === state.selectedSlideId) || null,
    [state.slides, state.selectedSlideId]
  );

  const selectedElement = useMemo(() => {
    if (!selectedSlide || !state.selectedElementId) return null;
    for (const board of selectedSlide.boards) {
      for (const colId of board.orderedColumnIds) {
        const col = selectedSlide.columnMap[colId];
        const item = col.items.find((i) => i.id === state.selectedElementId);
        if (item) return item;
      }
    }
    return null;
  }, [selectedSlide, state.selectedElementId]);

  const selectedColumn = useMemo(() => {
    if (!selectedSlide || !state.selectedColumnId) return null;
    return selectedSlide.columnMap[state.selectedColumnId] || null;
  }, [selectedSlide, state.selectedColumnId]);

  const selectedBoard = useMemo(() => {
    if (!selectedSlide || !state.selectedBoardId) return null;
    return selectedSlide.boards.find((b) => b.id === state.selectedBoardId) || null;
  }, [selectedSlide, state.selectedBoardId]);

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
      const columnEl = target?.closest(
        "[data-column-id]"
      ) as HTMLElement | null;
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
                  ? {
                      src: "https://via.placeholder.com/150",
                    }
                  : type === "video"
                  ? { url: "" }
                  : type === "quiz"
                  ? {
                      title: "Untitled Quiz",
                      description: "",
                      questions: [],
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
    [state.selectedSlideId, dispatch]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      if (!state.selectedSlideId || !type) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const columnEl = target?.closest(
        "[data-column-id]"
      ) as HTMLElement | null;
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
    state,
    setSlides,
    selectSlide,
    selectElement,
    selectColumn,
    selectBoard,
    selectedSlide,
    selectedElement,
    selectedColumn,
    selectedBoard,
    updateElement,
    updateColumn,
    updateBoard,
    cloneElement,
    deleteElement,
    handleDropElement,
    handleDragOver,
  };
}

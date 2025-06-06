"use client";

import { useCallback, useReducer, useMemo, useImperativeHandle } from "react";
import { Slide, createInitialBoard } from "../SlideSequencer";
import { BoardRow } from "../SlideElementsContainer";

export interface LessonEditorHandle {
  getContent: () => { slides: Slide[] };
  setContent: (slides: Slide[]) => void;
}

export interface LessonState {
  slides: Slide[];
  selectedSlideId: string | null;
  selectedElementId: string | null;
  selectedColumnId: string | null;
  selectedBoardId: string | null;
  dropIndicator: { columnId: string; index: number } | null;
}

export type Action =
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

export function useLessonSelection(ref?: React.Ref<LessonEditorHandle>) {
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

  const selectSlide = useCallback(
    (id: string | null) => dispatch({ type: "selectSlide", id }),
    [dispatch]
  );
  const selectElement = useCallback(
    (id: string | null) => dispatch({ type: "selectElement", id }),
    [dispatch]
  );
  const selectColumn = useCallback(
    (id: string | null) => dispatch({ type: "selectColumn", id }),
    [dispatch]
  );
  const selectBoard = useCallback(
    (id: string | null) => dispatch({ type: "selectBoard", id }),
    [dispatch]
  );

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

  return {
    state,
    dispatch,
    setSlides,
    selectSlide,
    selectElement,
    selectColumn,
    selectBoard,
    selectedSlide,
    selectedElement,
    selectedColumn,
    selectedBoard,
  };
}

"use client";

import type { LessonEditorHandle } from "./useLessonSelection";
import { useLessonSelection } from "./useLessonSelection";
import useBoardColumnHelpers from "./useBoardColumnHelpers";
import useDnDHandlers from "./useDnDHandlers";
import { availableFonts } from "@/theme/fonts";

export type { LessonEditorHandle } from "./useLessonSelection";

export function useLessonEditorState(
  ref?: React.Ref<LessonEditorHandle>,
  options?: { defaultColorToken: string; defaultFontFamily: string }
) {
  const selection = useLessonSelection(ref);
  const boardHelpers = useBoardColumnHelpers(selection.state, selection.dispatch);
  const dndHandlers = useDnDHandlers(selection.state, selection.dispatch, {
    defaultColorToken: options?.defaultColorToken ?? "",
    defaultFontFamily: options?.defaultFontFamily ?? availableFonts[0].fontFamily,
  });

  return {
    state: selection.state,
    setSlides: selection.setSlides,
    selectSlide: selection.selectSlide,
    selectElement: selection.selectElement,
    selectColumn: selection.selectColumn,
    selectBoard: selection.selectBoard,
    selectedSlide: selection.selectedSlide,
    selectedElement: selection.selectedElement,
    selectedColumn: selection.selectedColumn,
    selectedBoard: selection.selectedBoard,
    ...boardHelpers,
    ...dndHandlers,
  };
}

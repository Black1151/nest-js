"use client";

import type { LessonEditorHandle } from "./useLessonSelection";
import { useLessonSelection } from "./useLessonSelection";
import useBoardColumnHelpers from "./useBoardColumnHelpers";
import useDnDHandlers from "./useDnDHandlers";

export { LessonEditorHandle } from "./useLessonSelection";

export function useLessonEditorState(ref?: React.Ref<LessonEditorHandle>) {
  const selection = useLessonSelection(ref);
  const boardHelpers = useBoardColumnHelpers(selection.state, selection.dispatch);
  const dndHandlers = useDnDHandlers(selection.state, selection.dispatch);

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

"use client";

import { Flex, Box, Text, Grid, HStack } from "@chakra-ui/react";
import { useCallback, useReducer, useMemo } from "react";
import SlideSequencer, { Slide, createInitialBoard } from "./SlideSequencer";
import SlideElementsContainer from "./SlideElementsContainer";
import ElementAttributesPane from "./ElementAttributesPane";
import SlidePreview from "./SlidePreview";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface LessonState {
  slides: Slide[];
  selectedSlideId: string | null;
  selectedElementId: string | null;
  dropIndicator: { columnId: string; index: number } | null;
}

type Action =
  | { type: "setSlides"; updater: React.SetStateAction<Slide[]> }
  | { type: "selectSlide"; id: string | null }
  | { type: "selectElement"; id: string | null }
  | {
      type: "setDropIndicator";
      indicator: { columnId: string; index: number } | null;
    }
  | { type: "updateSlide"; slideId: string; updater: (slide: Slide) => Slide };

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
      return { ...state, selectedSlideId: action.id, selectedElementId: null };
    case "selectElement":
      return { ...state, selectedElementId: action.id };
    case "setDropIndicator":
      return { ...state, dropIndicator: action.indicator };
    case "updateSlide":
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId ? action.updater(s) : s
        ),
      };
    default:
      return state;
  }
}

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "video", label: "Video" },
];

export default function LessonEditor() {
  const initialSlide = {
    id: crypto.randomUUID(),
    title: "Slide 1",
    ...createInitialBoard(),
  };
  const [state, dispatch] = useReducer(reducer, {
    slides: [initialSlide],
    selectedSlideId: initialSlide.id,
    selectedElementId: null,
    dropIndicator: null,
  });

  const setSlides = useCallback(
    (updater: React.SetStateAction<Slide[]>) =>
      dispatch({ type: "setSlides", updater }),
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

  const handleDropElement = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("text/plain");
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
          const newEl: SlideElementDnDItemProps = {
            id: crypto.randomUUID(),
            type,
            ...(type === "text"
              ? {
                  text: "Sample Text",
                  styles: { color: "#000000", fontSize: "16px" },
                }
              : type === "video"
              ? { url: "" }
              : {}),
            wrapperStyles: {
              bgColor: "#ffffff",
              dropShadow: "none",
              paddingX: 0,
              paddingY: 0,
              marginX: 0,
              marginY: 0,
              borderColor: "#000000",
              borderWidth: 0,
              borderRadius: "none",
            },
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

  return (
    <Box>
      <Box p={4} borderWidth="1px" borderRadius="md">
        <HStack>
          {AVAILABLE_ELEMENTS.map((el) => (
            <Box
              key={el.type}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", el.type)}
              bgColor="white"
            >
              {el.label}
            </Box>
          ))}
        </HStack>
      </Box>

      <Flex gap={6} alignItems="flex-start">
        <SlideSequencer
          slides={state.slides}
          setSlides={setSlides as any}
          selectedSlideId={state.selectedSlideId}
          onSelect={(id) => dispatch({ type: "selectSlide", id })}
        />
        {state.selectedSlideId && (
          <Grid gap={4} flex={1} templateColumns="1fr 1fr 300px">
            <Box
              flex="1"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              onDragOver={handleDragOver}
              onDragLeave={() =>
                dispatch({ type: "setDropIndicator", indicator: null })
              }
              onDrop={handleDropElement}
            >
              <Text mb={2}>Slide Elements</Text>
              <SlideElementsContainer
                columnMap={selectedSlide!.columnMap}
                boards={selectedSlide!.boards}
                onChange={(columnMap, boards) =>
                  dispatch({
                    type: "updateSlide",
                    slideId: state.selectedSlideId!,
                    updater: (s) => ({ ...s, columnMap, boards }),
                  })
                }
                selectedElementId={state.selectedElementId}
                onSelectElement={(id) =>
                  dispatch({ type: "selectElement", id })
                }
                dropIndicator={state.dropIndicator}
              />
            </Box>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="md"
              minW="300px"
              bgColor="white"
            >
              <SlidePreview
                columnMap={selectedSlide!.columnMap}
                boards={selectedSlide!.boards}
              />
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md" minW="200px">
              <Text mb={2}>Attributes</Text>
              {selectedElement && (
                <ElementAttributesPane
                  element={selectedElement}
                  onChange={updateElement}
                />
              )}
            </Box>
          </Grid>
        )}
      </Flex>
    </Box>
  );
}

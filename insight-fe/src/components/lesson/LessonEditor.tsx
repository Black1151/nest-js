"use client";

import { Flex, Box, Text, Stack, Grid, HStack } from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import SlideSequencer, { Slide, createInitialBoard } from "./SlideSequencer";
import SlideElementsContainer from "./SlideElementsContainer";
import ElementAttributesPane from "./ElementAttributesPane";
import SlidePreview from "./SlidePreview";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface LessonState {
  slides: Slide[];
}

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
];

export default function LessonEditor() {
  const [lesson, setLesson] = useState<LessonState>({
    slides: [
      {
        id: crypto.randomUUID(),
        title: "Slide 1",
        ...createInitialBoard(),
      },
    ],
  });
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(
    lesson.slides[0].id
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [dropIndicator, setDropIndicator] = useState<{
    columnId: string;
    index: number;
  } | null>(null);

  const setSlides = useCallback((updater: React.SetStateAction<Slide[]>) => {
    setLesson((prev) => ({
      ...prev,
      slides:
        typeof updater === "function"
          ? (updater as (prev: Slide[]) => Slide[])(prev.slides)
          : updater,
    }));
  }, []);

  const selectedSlide = lesson.slides.find((s) => s.id === selectedSlideId);

  const getSelectedElement = (): SlideElementDnDItemProps | null => {
    if (!selectedSlide || !selectedElementId) return null;
    for (const board of selectedSlide.boards) {
      for (const colId of board.orderedColumnIds) {
        const col = selectedSlide.columnMap[colId];
        const item = col.items.find((i) => i.id === selectedElementId);
        if (item) return item;
      }
    }
    return null;
  };

  const updateElement = (updated: SlideElementDnDItemProps) => {
    if (!selectedSlideId) return;
    setLesson((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) => {
        if (slide.id !== selectedSlideId) return slide;
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
        return {
          ...slide,
          columnMap: newMap,
        };
      }),
    }));
  };

  const handleDropElement = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("text/plain");
    if (!selectedSlideId) return;
    if (!type) return;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;

    setLesson((prev) => {
      const slides = prev.slides.map((s) => {
        if (s.id !== selectedSlideId) return s;
        const newEl: SlideElementDnDItemProps = {
          id: crypto.randomUUID(),
          type,
          styles: type === "text" ? { color: "#000000", fontSize: "16px" } : {},
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
      });
      return { ...prev, slides };
    });
    setDropIndicator(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (!selectedSlideId || !type) return;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;
    if (!dropColumnId) {
      setDropIndicator(null);
      return;
    }

    const slide = lesson.slides.find((s) => s.id === selectedSlideId);
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

    setDropIndicator({ columnId: dropColumnId, index: insertIndex });
  };

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
          slides={lesson.slides}
          setSlides={setSlides as any}
          selectedSlideId={selectedSlideId}
          onSelect={setSelectedSlideId}
        />
        {selectedSlideId && (
          <Grid gap={4} flex={1} templateColumns="1fr 1fr 200px">
            <Box
              flex="1"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              onDragOver={handleDragOver}
              onDragLeave={() => setDropIndicator(null)}
              onDrop={handleDropElement}
            >
              <Text mb={2}>Slide Elements</Text>
              <SlideElementsContainer
                columnMap={
                  lesson.slides.find((s) => s.id === selectedSlideId)!.columnMap
                }
                boards={
                  lesson.slides.find((s) => s.id === selectedSlideId)!.boards
                }
                onChange={(columnMap, boards) =>
                  setLesson((prev) => ({
                    ...prev,
                    slides: prev.slides.map((s) =>
                      s.id === selectedSlideId ? { ...s, columnMap, boards } : s
                    ),
                  }))
                }
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                dropIndicator={dropIndicator}
              />
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md" minW="300px">
              <Text mb={2}>Preview</Text>
              <SlidePreview
                columnMap={
                  lesson.slides.find((s) => s.id === selectedSlideId)!.columnMap
                }
                boards={
                  lesson.slides.find((s) => s.id === selectedSlideId)!.boards
                }
              />
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md" minW="200px">
              <Text mb={2}>Attributes</Text>
              {getSelectedElement() && (
                <ElementAttributesPane
                  element={getSelectedElement()!}
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

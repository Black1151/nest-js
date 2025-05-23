"use client";

import { Flex, Box, Text, Stack } from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import SlideSequencer, { Slide, createInitialBoard } from "./SlideSequencer";
import SlideElementsBoard from "./SlideElementsBoard";
import ElementAttributesPane from "./ElementAttributesPane";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface LessonState {
  slides: Slide[];
}

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "audio", label: "Audio" },
  { type: "code", label: "Code Snippet" },
  { type: "quiz", label: "Quiz" },
];

export default function LessonEditor() {
  const [lesson, setLesson] = useState<LessonState>({
    slides: [
      {
        id: crypto.randomUUID(),
        title: "Slide 1",
        board: createInitialBoard(),
      },
    ],
  });
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(
    lesson.slides[0].id
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [dropIndicator, setDropIndicator] = useState<
    { columnId: string; index: number } | null
  >(null);

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
    for (const colId of selectedSlide.board.orderedColumnIds) {
      const col = selectedSlide.board.columnMap[colId];
      const item = col.items.find((i) => i.id === selectedElementId);
      if (item) return item;
    }
    return null;
  };

  const updateElement = (updated: SlideElementDnDItemProps) => {
    if (!selectedSlideId) return;
    setLesson((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) => {
        if (slide.id !== selectedSlideId) return slide;
        const newMap = {
          ...slide.board.columnMap,
        } as typeof slide.board.columnMap;
        for (const colId of slide.board.orderedColumnIds) {
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
        return {
          ...slide,
          board: { ...slide.board, columnMap: newMap },
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
    const columnEl = target?.closest('[data-column-id]') as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;

    setLesson((prev) => {
      const slides = prev.slides.map((s) => {
        if (s.id !== selectedSlideId) return s;
        const newEl: SlideElementDnDItemProps = {
          id: crypto.randomUUID(),
          type,
          styles: type === "text" ? { color: "#000000", fontSize: "16px" } : {},
        };

        const columnId =
          dropColumnId && s.board.columnMap[dropColumnId]
            ? dropColumnId
            : s.board.orderedColumnIds[0];
        const column = s.board.columnMap[columnId];

        let insertIndex = column.items.length;
        if (columnEl) {
          const cards = Array.from(
            columnEl.querySelectorAll('[data-card-id]')
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
          board: {
            ...s.board,
            columnMap: { ...s.board.columnMap, [columnId]: updatedColumn },
          },
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
    const columnEl = target?.closest('[data-column-id]') as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;
    if (!dropColumnId) {
      setDropIndicator(null);
      return;
    }

    const slide = lesson.slides.find((s) => s.id === selectedSlideId);
    if (!slide) return;
    const column = slide.board.columnMap[dropColumnId];
    if (!column) return;

    let insertIndex = column.items.length;
    if (columnEl) {
      const cards = Array.from(
        columnEl.querySelectorAll('[data-card-id]')
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
    <Flex gap={6} alignItems="flex-start">
      <SlideSequencer
        slides={lesson.slides}
        setSlides={setSlides as any}
        selectedSlideId={selectedSlideId}
        onSelect={setSelectedSlideId}
      />
      {selectedSlideId && (
        <Flex gap={4} flex={1}>
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
            <SlideElementsBoard
              board={
                lesson.slides.find((s) => s.id === selectedSlideId)?.board!
              }
              onChange={(board) =>
                setLesson((prev) => ({
                  ...prev,
                  slides: prev.slides.map((s) =>
                    s.id === selectedSlideId ? { ...s, board } : s
                  ),
                }))
              }
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              dropIndicator={dropIndicator}
            />
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="md">
            <Text mb={2}>Palette</Text>
            <Stack>
              {AVAILABLE_ELEMENTS.map((el) => (
                <Box
                  key={el.type}
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", el.type)
                  }
                >
                  {el.label}
                </Box>
              ))}
            </Stack>
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
        </Flex>
      )}
    </Flex>
  );
}

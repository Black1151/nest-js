"use client";

import { Flex, Box, Text, Stack } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import SlideSequencer, { Slide, createInitialBoard } from "./SlideSequencer";
import SlideElementsBoard from "./SlideElementsBoard";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface LessonState {
  slides: Slide[];
}

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
];

export default function LessonEditor() {
  const [lesson, setLesson] = useState<LessonState>({
    slides: [{ id: "1", title: "Slide 1", board: createInitialBoard() }],
  });
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>("1");

  const setSlides = useCallback((updater: React.SetStateAction<Slide[]>) => {
    setLesson((prev) => ({
      ...prev,
      slides:
        typeof updater === "function"
          ? (updater as (prev: Slide[]) => Slide[])(prev.slides)
          : updater,
    }));
  }, []);

  const handleDropElement = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (!selectedSlideId) return;
    setLesson((prev) => {
      const slides = prev.slides.map((s) => {
        if (s.id !== selectedSlideId) return s;
        const newEl: SlideElementDnDItemProps = {
          id: Date.now().toString(),
          type,
        };
        const firstColumnId = s.board.orderedColumnIds[0];
        const column = s.board.columnMap[firstColumnId];
        const updatedColumn = {
          ...column,
          items: [...column.items, newEl],
        };
        return {
          ...s,
          board: {
            ...s.board,
            columnMap: { ...s.board.columnMap, [firstColumnId]: updatedColumn },
          },
        };
      });
      return { ...prev, slides };
    });
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
            onDragOver={(e) => e.preventDefault()}
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
        </Flex>
      )}
    </Flex>
  );
}

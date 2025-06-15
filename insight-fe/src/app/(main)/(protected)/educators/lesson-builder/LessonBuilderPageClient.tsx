"use client";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import ThemeDropdown from "@/components/dropdowns/ThemeDropdown";
import StyleGroupManagement from "./components/StyleGroupManagement";
import { AvailableElements } from "./components/AvailableElements";
import StyledElementsPalette from "./components/StyledElementsPalette";
import BaseElementsPalette from "./components/BaseElementsPalette";
import SlideCanvas from "./components/SlideCanvas";
import SlideManager from "./components/SlideManager";
import { Slide, createInitialBoard } from "@/components/lesson/slide/SlideSequencer";

export const LessonBuilderPageClient = () => {
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null
  );
  const initial = createInitialBoard();
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: crypto.randomUUID(),
      title: "Slide 1",
      columnMap: initial.columnMap,
      boards: initial.boards,
    },
  ]);
  const [selectedSlideId, setSelectedSlideId] = useState<string>(slides[0].id);

  return (
    <VStack w="100%">
      <HStack flex={1} w="100%" align="start">
        <ThemeDropdown
          value={selectedThemeId ? String(selectedThemeId) : null}
          onChange={(theme) => {
            if (theme) {
              setSelectedThemeId(theme.id);
              setSelectedCollectionId(theme.styleCollectionId);
              setSelectedPaletteId(theme.defaultPaletteId);
            } else {
              setSelectedThemeId(null);
              setSelectedCollectionId(null);
              setSelectedPaletteId(null);
            }
          }}
        />
      </HStack>
      <HStack w="100%">
        <AvailableElements
          selectedType={selectedElementType}
          onSelect={setSelectedElementType}
        />
        <StyleGroupManagement
          collectionId={selectedCollectionId}
          elementType={selectedElementType}
          onSelectGroup={setSelectedGroupId}
        />
      </HStack>
      <HStack w="100%" align="start" pt={4} spacing={4}>
        <Flex flex={1} width="50%" bg="blue.100" p={4}>
          <BaseElementsPalette />
        </Flex>
        <Flex flex={1} width="50%" bg="green.100" p={4}>
          <StyledElementsPalette
            collectionId={selectedCollectionId}
            elementType={selectedElementType}
            groupId={selectedGroupId}
          />
        </Flex>
      </HStack>
      <SlideManager
        slides={slides}
        setSlides={setSlides}
        selectedSlideId={selectedSlideId}
        onSelectSlide={setSelectedSlideId}
      />
      {slides.length > 0 && (
        <SlideCanvas
          collectionId={selectedCollectionId}
          paletteId={selectedPaletteId}
          columnMap={slides.find((s) => s.id === selectedSlideId)!.columnMap}
          boards={slides.find((s) => s.id === selectedSlideId)!.boards}
          onChange={(map, b) =>
            setSlides((prev) =>
              prev.map((s) =>
                s.id === selectedSlideId ? { ...s, columnMap: map, boards: b } : s
              )
            )
          }
        />
      )}
    </VStack>
  );
};

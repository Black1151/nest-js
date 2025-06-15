"use client";
import { Flex, HStack, VStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_LESSON } from "@/graphql/lesson";
import ThemeDropdown from "@/components/dropdowns/ThemeDropdown";
import StyleGroupManagement from "./components/StyleGroupManagement";
import { AvailableElements } from "./components/AvailableElements";
import StyledElementsPalette from "./components/StyledElementsPalette";
import SlideCanvas from "./components/SlideCanvas";
import SlideManager from "./components/SlideManager";
import {
  Slide,
  createInitialBoard,
} from "@/components/lesson/slide/SlideSequencer";

export const LessonBuilderPageClient = () => {
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null,
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

  const [createLesson] = useMutation(CREATE_LESSON);

  const prepareContent = () => {
    return {
      slides: slides.map((s) => ({
        ...s,
        columnMap: Object.fromEntries(
          Object.entries(s.columnMap).map(([cid, col]) => [
            cid,
            {
              ...col,
              items: col.items.map(({ styles, ...rest }) => rest),
            },
          ]),
        ),
      })),
    };
  };

  const handleSave = async () => {
    await createLesson({
      variables: {
        data: {
          title: "Untitled Lesson",
          themeId: selectedThemeId,
          content: prepareContent(),
        },
      },
    });
  };

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
      <Flex w="100%" align="start" pt={4} bg="green.100" p={4}>
        <StyledElementsPalette
          collectionId={selectedCollectionId}
          elementType={selectedElementType}
          groupId={selectedGroupId}
        />
      </Flex>
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
                s.id === selectedSlideId
                  ? { ...s, columnMap: map, boards: b }
                  : s,
              ),
            )
          }
        />
      )}
      <Button onClick={handleSave} colorScheme="teal" alignSelf="flex-start">
        Save Lesson
      </Button>
    </VStack>
  );
};

"use client";
import { Flex, HStack, VStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_LESSON, GET_LESSON, GET_THEME } from "@/graphql/lesson";
import ThemeDropdown from "@/components/dropdowns/ThemeDropdown";
import StyleGroupManagement from "./components/StyleGroupManagement";
import { AvailableElements } from "./components/AvailableElements";
import StyledElementsPalette from "./components/StyledElementsPalette";
import SlideCanvas from "./components/SlideCanvas";
import SlideManager from "./components/SlideManager";
import SaveLessonModal from "./components/SaveLessonModal";
import LoadLessonModal from "./components/LoadLessonModal";
import {
  Slide,
  createInitialBoard,
} from "@/components/lesson/slide/SlideSequencer";
import {
  defaultBoardWrapperStyles,
  defaultColumnWrapperStyles,
} from "@/components/lesson/defaultStyles";

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
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [loadLessonQuery] = useLazyQuery(GET_LESSON);
  const [getTheme] = useLazyQuery(GET_THEME);

  const deserializeSlides = (data: any): Slide[] => {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return [];
      }
    }
    if (!Array.isArray(data)) return [];
    return data.map((slide) => {
      const columnMap: Record<string, any> = {};
      if (slide.columnMap) {
        Object.entries(slide.columnMap).forEach(([cid, col]: any) => {
          columnMap[cid] = {
            title: col.title || "",
            columnId: col.columnId || cid,
            styles:
              col.styles || {
                container: { border: "1px dashed gray", width: "100%" },
              },
            wrapperStyles: {
              ...defaultColumnWrapperStyles,
              ...(col.wrapperStyles || {}),
            },
            items: (col.items || []).map((it: any) => ({ ...it })),
            spacing: col.spacing ?? 0,
          };
        });
      }
      const boards = (slide.boards || []).map((b: any) => ({
        id: b.id || crypto.randomUUID(),
        orderedColumnIds: b.orderedColumnIds || [],
        wrapperStyles: {
          ...defaultBoardWrapperStyles,
          ...(b.wrapperStyles || {}),
        },
        spacing: b.spacing ?? 0,
      }));
      return {
        id: slide.id || crypto.randomUUID(),
        title: slide.title || "",
        columnMap,
        boards,
      } as Slide;
    });
  };

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

  const handleSave = async ({
    name,
    subjectId,
    topicId,
  }: {
    name: string;
    subjectId: string;
    topicId: string;
  }) => {
    await createLesson({
      variables: {
        data: {
          title: name,
          themeId: selectedThemeId,
          content: prepareContent(),
          relationIds: [
            { relation: "subject", ids: [Number(subjectId)] },
            { relation: "topic", ids: [Number(topicId)] },
          ],
        },
      },
    });
  }; 

  const handleLoad = async (lessonId: string) => {
    const { data } = await loadLessonQuery({
      variables: { data: { id: lessonId } },
    });
    if (!data?.getLesson) return;
    const lessonRaw = data.getLesson as any;
    const lesson = {
      ...lessonRaw,
      content:
        typeof lessonRaw.content === "string"
          ? JSON.parse(lessonRaw.content)
          : lessonRaw.content,
    } as any;
    if (lesson.themeId) {
      setSelectedThemeId(Number(lesson.themeId));
      const themeRes = await getTheme({ variables: { id: String(lesson.themeId) } });
      if (themeRes.data?.getTheme) {
        setSelectedCollectionId(Number(themeRes.data.getTheme.styleCollectionId));
        setSelectedPaletteId(Number(themeRes.data.getTheme.defaultPaletteId));
        setSelectedElementType(null);
        setSelectedGroupId(null);
      } else {
        setSelectedCollectionId(null);
        setSelectedPaletteId(null);
        setSelectedElementType(null);
        setSelectedGroupId(null);
      }
    } else {
      setSelectedThemeId(null);
      setSelectedCollectionId(null);
      setSelectedPaletteId(null);
      setSelectedElementType(null);
      setSelectedGroupId(null);
    }
    const loadedSlides = deserializeSlides(lesson.content?.slides ?? []);
    if (loadedSlides.length) {
      setSlides(loadedSlides);
      setSelectedSlideId(loadedSlides[0].id);
    } else {
      const init = createInitialBoard();
      const first = {
        id: crypto.randomUUID(),
        title: "Slide 1",
        columnMap: init.columnMap,
        boards: init.boards,
      } as Slide;
      setSlides([first]);
      setSelectedSlideId(first.id);
    }
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
      <Button onClick={() => setIsLoadOpen(true)} colorScheme="teal" alignSelf="flex-start">
        Load Lesson
      </Button>
      <Button onClick={() => setIsSaveOpen(true)} colorScheme="teal" alignSelf="flex-start">
        Save Lesson
      </Button>
      <SaveLessonModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        onSave={(data) => {
          handleSave(data);
          setIsSaveOpen(false);
        }}
      />
      <LoadLessonModal
        isOpen={isLoadOpen}
        onClose={() => setIsLoadOpen(false)}
        onLoad={(id) => {
          handleLoad(id);
          setIsLoadOpen(false);
        }}
      />
    </VStack>
  );
};

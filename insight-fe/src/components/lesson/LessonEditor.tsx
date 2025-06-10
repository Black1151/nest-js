"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  CREATE_STYLE,
  GET_STYLES_WITH_CONFIG_BY_GROUP,
  GET_STYLE_GROUPS,
  GET_COLOR_PALETTES,
  GET_THEMES,
} from "@/graphql/lesson";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

import SlideCanvas from "./slide/SlideCanvas";
import StyleModals from "./StyleModals";
import { availableFonts } from "@/theme/fonts";
import { Slide } from "./slide/SlideSequencer";
import {
  useLessonEditorState,
  LessonEditorHandle,
} from "./hooks/useLessonEditorState";
import SlideToolbar from "./slide/SlideToolbar";

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "quiz", label: "Quiz" },
];

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};

const LessonEditor = forwardRef<LessonEditorHandle>(function LessonEditor(
  _,
  ref
) {
  const [styleCollections, setStyleCollections] = useState<
    { id: number; name: string }[]
  >([]);
  const [styleGroups, setStyleGroups] = useState<{
    id: number;
    name: string;
  }[]>([]);
  const [colorPalettes, setColorPalettes] = useState<{
    id: number;
    name: string;
    colors: string[];
  }[]>([]);
  const [themes, setThemes] = useState<{
    id: number;
    name: string;
    styleCollectionId: number;
    defaultPaletteId: number;
  }[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "">(
    ""
  );
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | "">("");
  const [selectedThemeId, setSelectedThemeId] = useState<number | "">("");
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);
  const [isLoadStyleOpen, setIsLoadStyleOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [styleItems, setStyleItems] = useState<SlideElementDnDItemProps[]>([]);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");

  const [fetchStyles, { data: stylesData }] = useLazyQuery(
    GET_STYLES_WITH_CONFIG_BY_GROUP,
    { fetchPolicy: "network-only" }
  );
  const [fetchGroups, { data: groupsData }] = useLazyQuery(GET_STYLE_GROUPS, {
    fetchPolicy: "network-only",
  });
  const [fetchPalettes, { data: palettesData }] = useLazyQuery(GET_COLOR_PALETTES);
  const [fetchThemes, { data: themesData }] = useLazyQuery(GET_THEMES);

  const selectedPalette =
    selectedPaletteId !== ""
      ? colorPalettes.find((p) => p.id === selectedPaletteId)
      : undefined;

  const editor = useLessonEditorState(undefined, {
    defaultColor: selectedPalette?.colors[0] ?? "#000000",
    defaultFontFamily: availableFonts[0].fontFamily,
  });

  // Sync toolbar element type with the currently selected element on the canvas
  useEffect(() => {
    if (editor.selectedElement && selectedCollectionId !== "") {
      setSelectedElementType(editor.selectedElement.type);
    }
  }, [editor.selectedElement, selectedCollectionId]);

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => ({ slides: editor.state.slides }),
      setContent: (slides: Slide[]) => {
        editor.setSlides(slides);
        editor.selectSlide(slides[0]?.id ?? null);
      },
      getThemeId: () => selectedThemeId,
      setTheme: (theme: { id: number; styleCollectionId: number; defaultPaletteId: number }) => {
        setSelectedCollectionId(theme.styleCollectionId);
        setSelectedThemeId(theme.id);
        setSelectedPaletteId(theme.defaultPaletteId);
      },
    }),
    [editor.state.slides, selectedThemeId, editor.setSlides, editor.selectSlide],
  );

  const {
    data: collectionsData,
    refetch: refetchCollections,
  } = useQuery(GET_STYLE_COLLECTIONS);
  const [createStyle] = useMutation(CREATE_STYLE);

  useEffect(() => {
    if (collectionsData?.getAllStyleCollection) {
      setStyleCollections(
        collectionsData.getAllStyleCollection.map((c: any) => ({
          id: Number(c.id),
          name: c.name,
        }))
      );
    }
  }, [collectionsData]);

  useEffect(() => {
    if (selectedCollectionId === "") {
      setStyleItems([]);
      setSelectedElementType(null);
      setSelectedGroupId("");
      setColorPalettes([]);
      setSelectedPaletteId("");
      setThemes([]);
      setSelectedThemeId("");
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (selectedCollectionId !== "") {
      fetchPalettes({
        variables: { collectionId: String(selectedCollectionId) },
      });
      fetchThemes({ variables: { collectionId: String(selectedCollectionId) } });
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (selectedCollectionId !== "" && selectedElementType) {
      fetchGroups({
        variables: {
          collectionId: String(selectedCollectionId),
          element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
        },
      });
    } else {
      setStyleGroups([]);
    }
    setSelectedGroupId("");
  }, [selectedCollectionId, selectedElementType]);

  useEffect(() => {
    if (groupsData?.getAllStyleGroup) {
      setStyleGroups(
        groupsData.getAllStyleGroup.map((g: any) => ({
          id: Number(g.id),
          name: g.name,
        }))
      );
    } else {
      setStyleGroups([]);
    }
  }, [groupsData]);

  useEffect(() => {
    if (
      selectedCollectionId !== "" &&
      selectedElementType &&
      selectedGroupId !== ""
    ) {
      fetchStyles({
        variables: {
          collectionId: String(selectedCollectionId),
          element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
          groupId: String(selectedGroupId),
        },
      });
    } else {
      setStyleItems([]);
    }
  }, [selectedCollectionId, selectedElementType, selectedGroupId]);

  useEffect(() => {
    if (palettesData?.getAllColorPalette) {
      setColorPalettes(
        palettesData.getAllColorPalette.map((p: any) => ({
          id: Number(p.id),
          name: p.name,
          colors: p.colors,
        }))
      );
    } else {
      setColorPalettes([]);
    }
  }, [palettesData]);

  useEffect(() => {
    if (themesData?.getAllTheme) {
      setThemes(themesData.getAllTheme);
    } else {
      setThemes([]);
    }
  }, [themesData]);

  useEffect(() => {
    if (selectedThemeId !== "") {
      const theme = themes.find((t) => t.id === selectedThemeId);
      if (theme) {
        setSelectedPaletteId(theme.defaultPaletteId);
      }
    }
  }, [selectedThemeId, themes]);

  const handleUpdatePalette = async (palette: {
    id: number;
    name: string;
    colors: string[];
  }) => {
    const normalized = {
      id: Number(palette.id),
      name: palette.name,
      colors: palette.colors,
    };
    setColorPalettes((p) => p.map((pl) => (pl.id === normalized.id ? normalized : pl)));
    await fetchPalettes({
      variables: { collectionId: String(selectedCollectionId) },
    });
  };

  const handleAddPalette = async (palette: {
    id: number;
    name: string;
    colors: string[];
  }) => {
    setColorPalettes((p) => [
      ...p,
      { id: Number(palette.id), name: palette.name, colors: palette.colors },
    ]);
    await fetchPalettes({
      variables: { collectionId: String(selectedCollectionId) },
    });
  };

  const handleDeletePalette = async (id: number) => {
    setColorPalettes((p) => p.filter((pl) => pl.id !== id));
    if (selectedPaletteId === id) {
      setSelectedPaletteId("");
    }
    await fetchPalettes({
      variables: { collectionId: String(selectedCollectionId) },
    });
  };

  useEffect(() => {
    if (stylesData?.getAllStyle) {
      const items = stylesData.getAllStyle.map((s: any) => ({
        ...(s.config as SlideElementDnDItemProps),
        id: crypto.randomUUID(),
      }));
      setStyleItems(items);
    } else {
      setStyleItems([]);
    }
  }, [stylesData]);

  return (
    <Box>
      <SlideToolbar
        availableElements={AVAILABLE_ELEMENTS}
        styleCollections={styleCollections}
        themes={themes}
        styleGroups={styleGroups}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        selectedThemeId={selectedThemeId}
        onSelectTheme={setSelectedThemeId}
        selectedElementType={selectedElementType}
        onSelectElement={setSelectedElementType}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        styleItems={styleItems}
        onAddCollection={async (collection) => {
          setStyleCollections([...styleCollections, collection]);
          await refetchCollections();
        }}
        onUpdateCollection={async (collection) => {
          setStyleCollections((cols) =>
            cols.map((c) => (c.id === collection.id ? collection : c))
          );
          await refetchCollections();
        }}
        onDeleteCollection={async (id) => {
          setStyleCollections((cols) => cols.filter((c) => c.id !== id));
          if (selectedCollectionId === id) {
            setSelectedCollectionId("");
          }
          await refetchCollections();
        }}
        onAddGroup={async (group) => {
          setStyleGroups([...styleGroups, group]);
          if (selectedCollectionId !== "" && selectedElementType) {
            await fetchGroups({
              variables: {
                collectionId: String(selectedCollectionId),
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            });
          }
        }}
        onUpdateGroup={async (group) => {
          setStyleGroups((gs) => gs.map((g) => (g.id === group.id ? group : g)));
          if (selectedCollectionId !== "" && selectedElementType) {
            await fetchGroups({
              variables: {
                collectionId: String(selectedCollectionId),
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            });
          }
        }}
        onDeleteGroup={async (id) => {
          setStyleGroups((gs) => gs.filter((g) => g.id !== id));
          if (selectedCollectionId === id) {
            setSelectedGroupId("");
          }
          if (selectedCollectionId !== "" && selectedElementType) {
            await fetchGroups({
              variables: {
                collectionId: String(selectedCollectionId),
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            });
          }
        }}
        colorPalettes={colorPalettes}
        selectedPaletteId={selectedPaletteId}
        onSelectPalette={setSelectedPaletteId}
        onAddPalette={handleAddPalette}
        onUpdatePalette={handleUpdatePalette}
        onDeletePalette={handleDeletePalette}
      />

      <SlideCanvas
        slides={editor.state.slides}
        setSlides={editor.setSlides as any}
        selectedSlideId={editor.state.selectedSlideId}
        selectSlide={(id) => editor.selectSlide(id)}
        selectedSlide={editor.selectedSlide}
        selectedElement={editor.selectedElement}
        selectedColumn={editor.selectedColumn}
        selectedBoard={editor.selectedBoard}
        dropIndicator={editor.state.dropIndicator}
        selectElement={(id) => editor.selectElement(id)}
        selectColumn={(id) => editor.selectColumn(id)}
        selectBoard={(id) => editor.selectBoard(id)}
        updateElement={editor.updateElement}
        cloneElement={editor.cloneElement}
        deleteElement={editor.deleteElement}
        updateColumn={editor.updateColumn}
        updateBoard={editor.updateBoard}
        handleDragOver={editor.handleDragOver}
        handleDropElement={editor.handleDropElement}
        openSaveStyle={() => setIsSaveStyleOpen(true)}
        openLoadStyle={() => setIsLoadStyleOpen(true)}
        colorPalettes={colorPalettes}
        selectedPaletteId={selectedPaletteId}
      />

      <StyleModals
        isSaveOpen={isSaveStyleOpen}
        isLoadOpen={isLoadStyleOpen}
        isPaletteOpen={isPaletteOpen}
        closeSave={() => setIsSaveStyleOpen(false)}
        closeLoad={() => setIsLoadStyleOpen(false)}
        closePalette={() => setIsPaletteOpen(false)}
        styleCollections={styleCollections}
        styleGroups={styleGroups}
        selectedCollectionId={selectedCollectionId}
        selectedElement={editor.selectedElement}
        onSave={async ({ name, collectionId, groupId }) => {
          if (!editor.selectedElement) return;
          await createStyle({
            variables: {
              data: {
                name,
                collectionId,
                groupId: groupId ?? undefined,
                element: ELEMENT_TYPE_TO_ENUM[editor.selectedElement.type],
                config: editor.selectedElement,
              },
            },
          });

          if (
            selectedCollectionId !== "" &&
            collectionId === selectedCollectionId &&
            selectedElementType === editor.selectedElement.type &&
            selectedGroupId !== "" &&
            groupId === selectedGroupId
          ) {
            await fetchStyles({
              variables: {
                collectionId: String(selectedCollectionId),
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
                groupId: String(selectedGroupId),
              },
            });
          }
        }}
        onAddCollection={async (collection) => {
          setStyleCollections([...styleCollections, collection]);
          await refetchCollections();
        }}
        onAddGroup={async (group) => {
          setStyleGroups([...styleGroups, group]);
          if (selectedCollectionId !== "" && selectedElementType) {
            await fetchGroups({
              variables: {
                collectionId: String(selectedCollectionId),
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            });
          }
        }}
        onAddPalette={handleAddPalette}
        onLoad={(styleId) => {
          if (!editor.selectedElement) return;
          console.log("load style", { styleId });
        }}
      />
    </Box>
  );
});

export default LessonEditor;

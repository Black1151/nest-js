"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect, forwardRef } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  CREATE_STYLE,
  GET_STYLES_WITH_CONFIG_BY_GROUP,
  GET_STYLE_GROUPS,
  GET_COLOR_PALETTES,
} from "@/graphql/lesson";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

import SlideCanvas from "./slide/SlideCanvas";
import StyleModals from "./StyleModals";
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
  const editor = useLessonEditorState(ref);

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
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "">(
    ""
  );
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | "">("");
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);
  const [isLoadStyleOpen, setIsLoadStyleOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [styleItems, setStyleItems] = useState<SlideElementDnDItemProps[]>([]);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");

  // Sync toolbar element type with the currently selected element on the canvas
  useEffect(() => {
    if (editor.selectedElement && selectedCollectionId !== "") {
      setSelectedElementType(editor.selectedElement.type);
    }
  }, [editor.selectedElement, selectedCollectionId]);

  const [fetchStyles, { data: stylesData }] = useLazyQuery(
    GET_STYLES_WITH_CONFIG_BY_GROUP,
    { fetchPolicy: "network-only" }
  );
  const [fetchGroups, { data: groupsData }] = useLazyQuery(GET_STYLE_GROUPS);
  const [fetchPalettes, { data: palettesData }] = useLazyQuery(GET_COLOR_PALETTES);

  const { data: collectionsData } = useQuery(GET_STYLE_COLLECTIONS);
  const [createStyle] = useMutation(CREATE_STYLE);

  useEffect(() => {
    if (collectionsData?.getAllStyleCollection) {
      setStyleCollections(collectionsData.getAllStyleCollection);
    }
  }, [collectionsData]);

  useEffect(() => {
    if (selectedCollectionId === "") {
      setStyleItems([]);
      setSelectedElementType(null);
      setSelectedGroupId("");
      setColorPalettes([]);
      setSelectedPaletteId("");
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (selectedCollectionId !== "") {
      fetchPalettes({
        variables: { collectionId: String(selectedCollectionId) },
      });
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (selectedCollectionId !== "" && selectedElementType) {
      fetchGroups({
        variables: {
          collectionId: String(selectedCollectionId),
          element: selectedElementType,
        },
      });
    } else {
      setStyleGroups([]);
    }
    setSelectedGroupId("");
  }, [selectedCollectionId, selectedElementType]);

  useEffect(() => {
    if (groupsData?.getAllStyleGroup) {
      setStyleGroups(groupsData.getAllStyleGroup);
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
          element: selectedElementType,
          groupId: String(selectedGroupId),
        },
      });
    } else {
      setStyleItems([]);
    }
  }, [selectedCollectionId, selectedElementType, selectedGroupId]);

  useEffect(() => {
    if (palettesData?.getAllColorPalette) {
      setColorPalettes(palettesData.getAllColorPalette);
    } else {
      setColorPalettes([]);
    }
  }, [palettesData]);

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
        styleGroups={styleGroups}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        selectedElementType={selectedElementType}
        onSelectElement={setSelectedElementType}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        styleItems={styleItems}
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
        openAddPalette={() => {
          if (selectedCollectionId !== "") {
            setIsPaletteOpen(true);
          }
        }}
        isAddPaletteDisabled={selectedCollectionId === ""}
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
                element: selectedElementType,
                groupId: String(selectedGroupId),
              },
            });
          }
        }}
        onAddCollection={(collection) =>
          setStyleCollections([...styleCollections, collection])
        }
        onAddGroup={(group) => setStyleGroups([...styleGroups, group])}
        onAddPalette={(palette) => {
          setColorPalettes((p) => [...p, palette]);
          fetchPalettes({
            variables: { collectionId: String(selectedCollectionId) },
          });
        }}
        onLoad={(styleId) => {
          if (!editor.selectedElement) return;
          console.log("load style", { styleId });
        }}
      />
    </Box>
  );
});

export default LessonEditor;

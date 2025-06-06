"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect, forwardRef } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  CREATE_STYLE,
  GET_STYLES_WITH_CONFIG,
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
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "">(
    ""
  );
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);
  const [isLoadStyleOpen, setIsLoadStyleOpen] = useState(false);
  const [styleItems, setStyleItems] = useState<SlideElementDnDItemProps[]>([]);

  const [fetchStyles, { data: stylesData, refetch }] = useLazyQuery(
    GET_STYLES_WITH_CONFIG,
    { fetchPolicy: "network-only" }
  );

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
    }
  }, [selectedCollectionId]);

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
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        styleItems={styleItems}
        onFetchStyles={async (type) => {
          if (selectedCollectionId === "") return;
          await fetchStyles({
            variables: {
              collectionId: String(selectedCollectionId),
              element: type,
            },
          });
        }}
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
      />

      <StyleModals
        isSaveOpen={isSaveStyleOpen}
        isLoadOpen={isLoadStyleOpen}
        closeSave={() => setIsSaveStyleOpen(false)}
        closeLoad={() => setIsLoadStyleOpen(false)}
        styleCollections={styleCollections}
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
            collectionId === selectedCollectionId
          ) {
            await fetchStyles({
              variables: {
                collectionId: String(selectedCollectionId),
                element: editor.selectedElement.type,
                groupId: groupId ?? null,
              },
            });
          }
        }}
        onAddCollection={(collection) =>
          setStyleCollections([...styleCollections, collection])
        }
        onLoad={(styleId) => {
          if (!editor.selectedElement) return;
          console.log("load style", { styleId });
        }}
      />
    </Box>
  );
});

export default LessonEditor;

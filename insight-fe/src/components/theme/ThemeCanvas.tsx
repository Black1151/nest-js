"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import ThemeSlideToolbar from "./ThemeSlideToolbar";
import SlideCanvas from "../lesson/slide/SlideCanvas";
import SaveStyleModal from "../lesson/modals/SaveStyleModal";
import {
  useLessonEditorState,
} from "../lesson/hooks/useLessonEditorState";
import { SlideElementDnDItemProps } from "../DnD/cards/SlideElementDnDCard";
import { CREATE_COMPONENT_VARIANT } from "@/graphql/lesson";

interface ThemeCanvasProps {
  /** Groups available when saving styles */
  styleGroups?: { id: number; name: string }[];
  /** Collection id for saving styles */
  collectionId?: number;
  /** Called whenever user confirms the save style modal */
  onSaveStyle?: (data: { name: string; groupId: number | null }) => void;
  /** Notifies when the selected element on the canvas changes */
  onSelectedElementChange?: (el: SlideElementDnDItemProps | null) => void;
  /** Palette dropdown options */
  paletteOptions: { label: string; value: string }[];
  selectedPaletteId: number | "";
  onSelectPalette: (id: number | "") => void;
  onCreatePalette: () => void;
  onEditPalette: () => void;
  onDeletePalette: () => void;
  /** Style group dropdown options */
  groupOptions: { label: string; value: string }[];
  selectedGroupId: number | "";
  onSelectGroup: (id: number | "") => void;
  onCreateGroup: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
}

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
];

export default function ThemeCanvas({
  styleGroups = [],
  collectionId,
  onSaveStyle,
  onSelectedElementChange,
  paletteOptions,
  selectedPaletteId,
  onSelectPalette,
  onCreatePalette,
  onEditPalette,
  onDeletePalette,
  groupOptions,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
}: ThemeCanvasProps) {
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null,
  );
  const [createVariant] = useMutation(CREATE_COMPONENT_VARIANT);

  const editor = useLessonEditorState();

  useEffect(() => {
    onSelectedElementChange?.(editor.selectedElement);
    setSelectedElementType(editor.selectedElement?.type ?? null);
  }, [editor.selectedElement, onSelectedElementChange]);

  return (
    <Box>
      <ThemeSlideToolbar
        availableElements={AVAILABLE_ELEMENTS}
        paletteOptions={paletteOptions}
        selectedPaletteId={selectedPaletteId}
        onSelectPalette={onSelectPalette}
        onCreatePalette={onCreatePalette}
        onEditPalette={onEditPalette}
        onDeletePalette={onDeletePalette}
        selectedElementType={selectedElementType}
        onSelectElement={setSelectedElementType}
        groupOptions={groupOptions}
        selectedGroupId={selectedGroupId}
        onSelectGroup={onSelectGroup}
        onCreateGroup={onCreateGroup}
        onEditGroup={onEditGroup}
        onDeleteGroup={onDeleteGroup}
        styleItems={[]}
      />
      <SlideCanvas
        slides={editor.state.slides}
        setSlides={editor.setSlides as any}
        selectedSlideId={editor.state.selectedSlideId}
        selectSlide={editor.selectSlide}
        selectedSlide={editor.selectedSlide}
        selectedElement={editor.selectedElement}
        selectedColumn={editor.selectedColumn}
        selectedBoard={editor.selectedBoard}
        dropIndicator={editor.state.dropIndicator}
        selectElement={editor.selectElement}
        selectColumn={editor.selectColumn}
        selectBoard={editor.selectBoard}
        updateElement={editor.updateElement}
        cloneElement={editor.cloneElement}
        deleteElement={editor.deleteElement}
        updateColumn={editor.updateColumn}
        updateBoard={editor.updateBoard}
        handleDragOver={editor.handleDragOver}
        handleDropElement={editor.handleDropElement}
        openSaveStyle={() => setIsSaveStyleOpen(true)}
        openLoadStyle={() => {}}
        showSequencer={false}
      />
      {editor.selectedElement && (
        <SaveStyleModal
          isOpen={isSaveStyleOpen}
          onClose={() => setIsSaveStyleOpen(false)}
          collectionId={collectionId as number}
          elementType={editor.selectedElement.type}
          groups={styleGroups}
          onSave={async (data) => {
            onSaveStyle?.({ name: data.name, groupId: data.groupId });
            if (data.asVariant && editor.selectedElement) {
              try {
                await createVariant({
                  variables: {
                    data: {
                      name: data.name,
                      props: editor.selectedElement,
                    },
                  },
                });
              } catch (e) {
                console.error(e);
              }
            }
            setIsSaveStyleOpen(false);
          }}
        />
      )}
    </Box>
  );
}

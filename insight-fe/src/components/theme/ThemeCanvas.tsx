"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import SlideToolbar from "../lesson/slide/SlideToolbar";
import SlideCanvas from "../lesson/slide/SlideCanvas";
import SaveStyleModal from "../lesson/modals/SaveStyleModal";
import {
  useLessonEditorState,
} from "../lesson/hooks/useLessonEditorState";
import { SlideElementDnDItemProps } from "../DnD/cards/SlideElementDnDCard";

interface ThemeCanvasProps {
  /** Groups available when saving styles */
  styleGroups?: { id: number; name: string }[];
  /** Collection id for saving styles */
  collectionId?: number;
  /** Called whenever user confirms the save style modal */
  onSaveStyle?: (data: { name: string; groupId: number | null }) => void;
  /** Notifies when the selected element on the canvas changes */
  onSelectedElementChange?: (el: SlideElementDnDItemProps | null) => void;
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
}: ThemeCanvasProps) {
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");

  const editor = useLessonEditorState();

  useEffect(() => {
    onSelectedElementChange?.(editor.selectedElement);
    setSelectedElementType(editor.selectedElement?.type ?? null);
  }, [editor.selectedElement, onSelectedElementChange]);

  return (
    <Box>
      <SlideToolbar
        availableElements={AVAILABLE_ELEMENTS}
        styleGroups={styleGroups}
        selectedCollectionId={collectionId ?? ""}
        selectedThemeId=""
        onSelectTheme={() => {}}
        selectedPaletteId=""
        onSelectPalette={() => {}}
        selectedElementType={selectedElementType}
        onSelectElement={setSelectedElementType}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
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
      />
      {editor.selectedElement && (
        <SaveStyleModal
          isOpen={isSaveStyleOpen}
          onClose={() => setIsSaveStyleOpen(false)}
          collectionId={collectionId as number}
          elementType={editor.selectedElement.type}
          groups={styleGroups}
          onSave={(data) => {
            onSaveStyle?.(data);
            setIsSaveStyleOpen(false);
          }}
        />
      )}
    </Box>
  );
}

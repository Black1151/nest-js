"use client";

import LoadStyleModal from "./modals/LoadStyleModal";
import SaveStyleModal from "./modals/SaveStyleModal";
import ColorPaletteModal from "./modals/AddColorPaletteModal";

import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface StyleModalsProps {
  isSaveOpen: boolean;
  isLoadOpen: boolean;
  isPaletteOpen: boolean;
  closeSave: () => void;
  closeLoad: () => void;
  closePalette: () => void;
  styleCollections: { id: number; name: string }[];
  styleGroups: { id: number; name: string }[];
  selectedCollectionId: number | "";
  selectedElement: SlideElementDnDItemProps | null;
  onSave: (data: { name: string; collectionId: number; groupId: number | null }) => void;
  onAddCollection: (collection: { id: number; name: string }) => void;
  onAddGroup: (group: { id: number; name: string }) => void;
  onAddPalette: (palette: { id: number; name: string; colors: string[] }) => void;
  onLoad: (styleId: number) => void;
}

export default function StyleModals({
  isSaveOpen,
  isLoadOpen,
  isPaletteOpen,
  closeSave,
  closeLoad,
  closePalette,
  styleCollections,
  styleGroups,
  selectedCollectionId,
  selectedElement,
  onSave,
  onAddCollection,
  onAddGroup,
  onAddPalette,
  onLoad,
}: StyleModalsProps) {
  return (
    <>
      <SaveStyleModal
        isOpen={isSaveOpen}
        onClose={closeSave}
        collections={styleCollections}
        elementType={selectedElement ? selectedElement.type : null}
        groups={styleGroups}
        onSave={onSave}
        onAddCollection={onAddCollection}
        onAddGroup={onAddGroup}
      />
      <LoadStyleModal
        isOpen={isLoadOpen}
        onClose={closeLoad}
        collections={styleCollections}
        elementType={selectedElement ? selectedElement.type : null}
        groups={styleGroups}
        onLoad={onLoad}
      />
      {selectedCollectionId !== "" && (
        <ColorPaletteModal
          isOpen={isPaletteOpen}
          onClose={closePalette}
          collectionId={selectedCollectionId as number}
          onSave={onAddPalette}
        />
      )}
    </>
  );
}

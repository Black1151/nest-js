"use client";

import LoadStyleModal from "./modals/LoadStyleModal";
import SaveStyleModal from "./modals/SaveStyleModal";

import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface StyleModalsProps {
  isSaveOpen: boolean;
  isLoadOpen: boolean;
  closeSave: () => void;
  closeLoad: () => void;
  styleCollections: { id: number; name: string }[];
  selectedElement: SlideElementDnDItemProps | null;
  onSave: (data: { name: string; collectionId: number }) => void;
  onAddCollection: (collection: { id: number; name: string }) => void;
  onLoad: (styleId: number) => void;
}

export default function StyleModals({
  isSaveOpen,
  isLoadOpen,
  closeSave,
  closeLoad,
  styleCollections,
  selectedElement,
  onSave,
  onAddCollection,
  onLoad,
}: StyleModalsProps) {
  return (
    <>
      <SaveStyleModal
        isOpen={isSaveOpen}
        onClose={closeSave}
        collections={styleCollections}
        onSave={onSave}
        onAddCollection={onAddCollection}
      />
      <LoadStyleModal
        isOpen={isLoadOpen}
        onClose={closeLoad}
        collections={styleCollections}
        elementType={selectedElement ? selectedElement.type : null}
        onLoad={onLoad}
      />
    </>
  );
}

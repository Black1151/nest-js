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
  styleGroups: { id: number; name: string }[];
  selectedElement: SlideElementDnDItemProps | null;
  onSave: (data: { name: string; collectionId: number; groupId: number | null }) => void;
  onAddCollection: (collection: { id: number; name: string }) => void;
  onAddGroup: (group: { id: number; name: string }) => void;
  onLoad: (styleId: number) => void;
}

export default function StyleModals({
  isSaveOpen,
  isLoadOpen,
  closeSave,
  closeLoad,
  styleCollections,
  styleGroups,
  selectedElement,
  onSave,
  onAddCollection,
  onAddGroup,
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
    </>
  );
}

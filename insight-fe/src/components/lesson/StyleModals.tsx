"use client";

import LoadStyleModal from "./modals/LoadStyleModal";
import SaveStyleModal from "./modals/SaveStyleModal";

import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface StyleModalsProps {
  isSaveOpen: boolean;
  isLoadOpen: boolean;
  closeSave: () => void;
  closeLoad: () => void;
  styleGroups: { id: number; name: string }[];
  selectedCollectionId: number | "";
  selectedElement: SlideElementDnDItemProps | null;
  onSave: (data: { name: string; groupId: number | null }) => void;
  onLoad: (styleId: number) => void;
}

export default function StyleModals({
  isSaveOpen,
  isLoadOpen,
  closeSave,
  closeLoad,
  styleGroups,
  selectedCollectionId,
  selectedElement,
  onSave,
  onLoad,
}: StyleModalsProps) {
  return (
    <>
      <SaveStyleModal
        isOpen={isSaveOpen}
        onClose={closeSave}
        collectionId={selectedCollectionId as number}
        elementType={selectedElement ? selectedElement.type : null}
        groups={styleGroups}
        onSave={(data) => onSave({ name: data.name, groupId: data.groupId })}
      />
      <LoadStyleModal
        isOpen={isLoadOpen}
        onClose={closeLoad}
        collectionId={selectedCollectionId as number}
        elementType={selectedElement ? selectedElement.type : null}
        groups={styleGroups}
        onLoad={onLoad}
      />
    </>
  );
}

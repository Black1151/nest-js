"use client";

import { HStack } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";

import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import AddStyleCollectionModal from "@/components/lesson/modals/AddStyleCollectionModal";
import AddColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import AddStyleGroupModal from "@/components/lesson/modals/AddStyleGroupModal";
import {
  CREATE_STYLE_COLLECTION,
  UPDATE_STYLE_COLLECTION,
  DELETE_STYLE_COLLECTION,
  CREATE_STYLE_GROUP,
  UPDATE_STYLE_GROUP,
  DELETE_STYLE_GROUP,
  CREATE_COLOR_PALETTE,
  UPDATE_COLOR_PALETTE,
  DELETE_COLOR_PALETTE,
} from "@/graphql/lesson";

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};

interface ThemeToolbarProps {
  styleCollections: { id: number; name: string }[];
  styleGroups: { id: number; name: string }[];
  colorPalettes: { id: number; name: string; colors: string[] }[];
  selectedCollectionId: number | "";
  onSelectCollection: (id: number | "") => void;
  selectedPaletteId: number | "";
  onSelectPalette: (id: number | "") => void;
  selectedElementType: string | null;
  selectedGroupId: number | "";
  onSelectGroup: (id: number | "") => void;
  onAddCollection: (collection: { id: number; name: string }) => void;
  onUpdateCollection?: (collection: { id: number; name: string }) => void;
  onDeleteCollection?: (id: number) => void;
  onAddGroup: (group: { id: number; name: string }) => void;
  onUpdateGroup?: (group: { id: number; name: string }) => void;
  onDeleteGroup?: (id: number) => void;
  onAddPalette: (palette: { id: number; name: string; colors: string[] }) => void;
  onUpdatePalette?: (palette: { id: number; name: string; colors: string[] }) => void;
  onDeletePalette?: (id: number) => void;
}

export default function ThemeToolbar({
  styleCollections,
  styleGroups,
  colorPalettes,
  selectedCollectionId,
  onSelectCollection,
  selectedPaletteId,
  onSelectPalette,
  selectedElementType,
  selectedGroupId,
  onSelectGroup,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
  onAddPalette,
  onUpdatePalette,
  onDeletePalette,
}: ThemeToolbarProps) {
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [isAddPaletteOpen, setIsAddPaletteOpen] = useState(false);
  const [isEditPaletteOpen, setIsEditPaletteOpen] = useState(false);
  const [isDeletePaletteOpen, setIsDeletePaletteOpen] = useState(false);

  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [updateCollection] = useMutation(UPDATE_STYLE_COLLECTION);
  const [deleteCollection, { loading: deletingCollection }] = useMutation(
    DELETE_STYLE_COLLECTION,
  );
  const [createGroup] = useMutation(CREATE_STYLE_GROUP);
  const [updateGroup] = useMutation(UPDATE_STYLE_GROUP);
  const [deleteGroup, { loading: deletingGroup }] = useMutation(DELETE_STYLE_GROUP);
  const [createPalette] = useMutation(CREATE_COLOR_PALETTE);
  const [updatePalette] = useMutation(UPDATE_COLOR_PALETTE);
  const [deletePalette, { loading: deletingPalette }] = useMutation(DELETE_COLOR_PALETTE);

  const selectedCollection =
    selectedCollectionId !== ""
      ? styleCollections.find((c) => c.id === selectedCollectionId)
      : undefined;
  const collectionOptions = useMemo(
    () => styleCollections.map((c) => ({ label: c.name, value: String(c.id) })),
    [styleCollections],
  );

  const selectedPalette =
    selectedPaletteId !== ""
      ? colorPalettes.find((p) => p.id === selectedPaletteId)
      : undefined;
  const paletteOptions = useMemo(
    () => colorPalettes.map((p) => ({ label: p.name, value: String(p.id) })),
    [colorPalettes],
  );

  const selectedGroup =
    selectedGroupId !== ""
      ? styleGroups.find((g) => g.id === selectedGroupId)
      : undefined;
  const groupOptions = useMemo(
    () => styleGroups.map((g) => ({ label: g.name, value: String(g.id) })),
    [styleGroups],
  );

  return (
    <>
      <HStack w="full">
        <CrudDropdown
          options={collectionOptions}
          value={selectedCollectionId}
          onChange={(e) =>
            onSelectCollection(e.target.value === "" ? "" : parseInt(e.target.value, 10))
          }
          onCreate={() => setIsAddCollectionOpen(true)}
          onUpdate={() => setIsEditCollectionOpen(true)}
          onDelete={() => setIsDeleteCollectionOpen(true)}
          isUpdateDisabled={selectedCollectionId === ""}
          isDeleteDisabled={selectedCollectionId === ""}
        />
        <CrudDropdown
          options={paletteOptions}
          value={selectedPaletteId}
          onChange={(e) =>
            onSelectPalette(e.target.value === "" ? "" : parseInt(e.target.value, 10))
          }
          onCreate={() => setIsAddPaletteOpen(true)}
          onUpdate={() => setIsEditPaletteOpen(true)}
          onDelete={() => setIsDeletePaletteOpen(true)}
          isDisabled={selectedCollectionId === ""}
          isCreateDisabled={selectedCollectionId === ""}
          isUpdateDisabled={selectedPaletteId === ""}
          isDeleteDisabled={selectedPaletteId === ""}
        />
        <CrudDropdown
          options={groupOptions}
          value={selectedGroupId}
          onChange={(e) =>
            onSelectGroup(e.target.value === "" ? "" : parseInt(e.target.value, 10))
          }
          onCreate={() => setIsAddGroupOpen(true)}
          onUpdate={() => setIsEditGroupOpen(true)}
          onDelete={() => setIsDeleteGroupOpen(true)}
          isDisabled={selectedCollectionId === ""}
          isCreateDisabled={selectedCollectionId === "" || !selectedElementType}
          isUpdateDisabled={selectedGroupId === ""}
          isDeleteDisabled={selectedGroupId === ""}
        />
      </HStack>

      <AddStyleCollectionModal
        isOpen={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        onSave={async (name) => {
          const { data } = await createCollection({ variables: { data: { name } } });
          if (data?.createStyleCollection) {
            onAddCollection({
              id: Number(data.createStyleCollection.id),
              name: data.createStyleCollection.name,
            });
          }
        }}
      />

      <AddStyleCollectionModal
        isOpen={isEditCollectionOpen}
        onClose={() => setIsEditCollectionOpen(false)}
        title="Update Style Collection"
        confirmLabel="Update"
        initialName={selectedCollection?.name ?? ""}
        onSave={async (name) => {
          if (selectedCollectionId === "") return;
          const { data } = await updateCollection({
            variables: { data: { id: selectedCollectionId, name } },
          });
          if (data?.updateStyleCollection) {
            onUpdateCollection?.({ id: selectedCollectionId, name: data.updateStyleCollection.name });
          }
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteCollectionOpen}
        onClose={() => setIsDeleteCollectionOpen(false)}
        action="delete collection"
        bodyText="Are you sure you want to delete this collection?"
        onConfirm={async () => {
          if (selectedCollectionId === "") return;
          await deleteCollection({ variables: { data: { id: selectedCollectionId } } });
          onDeleteCollection?.(selectedCollectionId);
          setIsDeleteCollectionOpen(false);
        }}
        isLoading={deletingCollection}
      />

      <AddStyleGroupModal
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
        onSave={async (name) => {
          if (selectedCollectionId === "" || !selectedElementType) return;
          const { data } = await createGroup({
            variables: {
              data: {
                name,
                collectionId: selectedCollectionId,
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            },
          });
          if (data?.createStyleGroup) {
            onAddGroup({ id: Number(data.createStyleGroup.id), name: data.createStyleGroup.name });
          }
        }}
      />

      <AddStyleGroupModal
        isOpen={isEditGroupOpen}
        onClose={() => setIsEditGroupOpen(false)}
        title="Update Style Group"
        confirmLabel="Update"
        initialName={selectedGroup?.name ?? ""}
        onSave={async (name) => {
          if (selectedGroupId === "" || selectedCollectionId === "" || !selectedElementType)
            return;
          const { data } = await updateGroup({
            variables: {
              data: {
                id: selectedGroupId,
                name,
                collectionId: selectedCollectionId,
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            },
          });
          if (data?.updateStyleGroup) {
            onUpdateGroup?.({ id: selectedGroupId, name: data.updateStyleGroup.name });
          }
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteGroupOpen}
        onClose={() => setIsDeleteGroupOpen(false)}
        action="delete group"
        bodyText="Are you sure you want to delete this group?"
        onConfirm={async () => {
          if (selectedGroupId === "") return;
          await deleteGroup({ variables: { data: { id: selectedGroupId } } });
          onDeleteGroup?.(selectedGroupId);
          setIsDeleteGroupOpen(false);
        }}
        isLoading={deletingGroup}
      />

      <AddColorPaletteModal
        key="add-palette"
        isOpen={isAddPaletteOpen}
        onClose={() => setIsAddPaletteOpen(false)}
        collectionId={selectedCollectionId as number}
        onSave={(palette) => {
          onAddPalette(palette);
        }}
      />

      <AddColorPaletteModal
        key={`edit-palette-${selectedPaletteId}`}
        isOpen={isEditPaletteOpen}
        onClose={() => setIsEditPaletteOpen(false)}
        collectionId={selectedCollectionId as number}
        paletteId={selectedPaletteId === "" ? undefined : selectedPaletteId}
        initialName={selectedPalette?.name ?? ""}
        initialColors={selectedPalette?.colors ?? []}
        title="Update Color Palette"
        confirmLabel="Update"
        onSave={(palette) => {
          onUpdatePalette?.(palette);
        }}
      />

      <ConfirmationModal
        isOpen={isDeletePaletteOpen}
        onClose={() => setIsDeletePaletteOpen(false)}
        action="delete palette"
        bodyText="Are you sure you want to delete this palette?"
        onConfirm={async () => {
          if (selectedPaletteId === "") return;
          await deletePalette({ variables: { data: { id: selectedPaletteId } } });
          onDeletePalette?.(selectedPaletteId);
          setIsDeletePaletteOpen(false);
        }}
        isLoading={deletingPalette}
      />
    </>
  );
}

"use client";

import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import AddStyleCollectionModal from "../modals/AddStyleCollectionModal";
import AddStyleGroupModal from "../modals/AddStyleGroupModal";
import {
  CREATE_STYLE_COLLECTION,
  UPDATE_STYLE_COLLECTION,
  DELETE_STYLE_COLLECTION,
  CREATE_STYLE_GROUP,
  UPDATE_STYLE_GROUP,
  DELETE_STYLE_GROUP,
} from "@/graphql/lesson";

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};

interface SlideToolbarProps {
  availableElements: { type: string; label: string }[];
  styleCollections: { id: number; name: string }[];
  styleGroups: { id: number; name: string }[];
  selectedCollectionId: number | "";
  onSelectCollection: (id: number | "") => void;
  selectedElementType: string | null;
  onSelectElement: (type: string) => void;
  selectedGroupId: number | "";
  onSelectGroup: (id: number | "") => void;
  styleItems: SlideElementDnDItemProps[];
  onAddCollection: (collection: { id: number; name: string }) => void;
  onUpdateCollection?: (collection: { id: number; name: string }) => void;
  onDeleteCollection?: (id: number) => void;
  onAddGroup: (group: { id: number; name: string }) => void;
  onUpdateGroup?: (group: { id: number; name: string }) => void;
  onDeleteGroup?: (id: number) => void;
}

export default function SlideToolbar({
  availableElements,
  styleCollections,
  styleGroups,
  selectedCollectionId,
  onSelectCollection,
  selectedElementType,
  onSelectElement,
  selectedGroupId,
  onSelectGroup,
  styleItems,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
}: SlideToolbarProps) {
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);

  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [updateCollection] = useMutation(UPDATE_STYLE_COLLECTION);
  const [deleteCollection, { loading: deleting }] = useMutation(
    DELETE_STYLE_COLLECTION,
  );
  const [createGroup] = useMutation(CREATE_STYLE_GROUP);
  const [updateGroup] = useMutation(UPDATE_STYLE_GROUP);
  const [deleteGroup, { loading: deletingGroup }] = useMutation(
    DELETE_STYLE_GROUP,
  );

  const selectedCollection =
    selectedCollectionId !== ""
      ? styleCollections.find((c) => c.id === selectedCollectionId)
      : undefined;
  const collectionOptions = useMemo(
    () =>
      styleCollections.map((c) => ({ label: c.name, value: String(c.id) })),
    [styleCollections]
  );
  const selectedGroup =
    selectedGroupId !== ""
      ? styleGroups.find((g) => g.id === selectedGroupId)
      : undefined;
  const groupOptions = useMemo(
    () => styleGroups.map((g) => ({ label: g.name, value: String(g.id) })),
    [styleGroups]
  );
  return (
    <>
      <Box p={4} borderWidth="1px" borderRadius="md">
        <HStack>
          {availableElements.map((el) => (
            <Box
              key={el.type}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", el.type)}
              bgColor="white"
            >
              {el.label}
            </Box>
          ))}
        </HStack>
      </Box>
      <VStack mt={2} alignItems="flex-start">
        <CrudDropdown
          options={collectionOptions}
          value={selectedCollectionId}
          onChange={(e) =>
            onSelectCollection(
              e.target.value === "" ? "" : parseInt(e.target.value, 10)
            )
          }
          onCreate={() => setIsAddCollectionOpen(true)}
          onUpdate={() => setIsEditCollectionOpen(true)}
          onDelete={() => setIsDeleteCollectionOpen(true)}
          isUpdateDisabled={selectedCollectionId === ""}
          isDeleteDisabled={selectedCollectionId === ""}
        />
        <HStack>
          {availableElements.map((el) => (
            <Button
              key={el.type}
              size="sm"
              onClick={() => onSelectElement(el.type)}
            >
              {el.label}
            </Button>
          ))}
        </HStack>
        {selectedElementType && (
          <CrudDropdown
            options={groupOptions}
            value={selectedGroupId}
            onChange={(e) =>
              onSelectGroup(
                e.target.value === "" ? "" : parseInt(e.target.value, 10)
              )
            }
            onCreate={() => setIsAddGroupOpen(true)}
            onUpdate={() => setIsEditGroupOpen(true)}
            onDelete={() => setIsDeleteGroupOpen(true)}
            isDisabled={selectedCollectionId === ""}
            isCreateDisabled={selectedCollectionId === "" || !selectedElementType}
            isUpdateDisabled={selectedGroupId === ""}
            isDeleteDisabled={selectedGroupId === ""}
          />
        )}
      </VStack>
      {styleItems.length > 0 && (
        <HStack mt={2} overflowX="auto">
          {styleItems.map((item, idx) => (
            <Box
              key={idx}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({ type: item.type, config: item })
                )
              }
            >
              <SlideElementDnDItem item={item} />
            </Box>
          ))}
        </HStack>
      )}
      <AddStyleCollectionModal
        isOpen={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        onSave={async (name) => {
          const { data } = await createCollection({
            variables: { data: { name } },
          });
          if (data?.createStyleCollection) {
            onAddCollection({
              id: data.createStyleCollection.id,
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
            onUpdateCollection?.({
              id: selectedCollectionId,
              name: data.updateStyleCollection.name,
            });
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
          await deleteCollection({
            variables: { data: { id: selectedCollectionId } },
          });
          onDeleteCollection?.(selectedCollectionId);
          setIsDeleteCollectionOpen(false);
        }}
        isLoading={deleting}
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
            onAddGroup({
              id: data.createStyleGroup.id,
              name: data.createStyleGroup.name,
            });
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
          if (
            selectedGroupId === "" ||
            selectedCollectionId === "" ||
            !selectedElementType
          )
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
            onUpdateGroup?.({
              id: selectedGroupId,
              name: data.updateStyleGroup.name,
            });
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
    </>
  );
}

"use client";

import { Box, HStack, VStack, Button, Select } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import AddStyleCollectionModal from "../modals/AddStyleCollectionModal";
import {
  CREATE_STYLE_COLLECTION,
  UPDATE_STYLE_COLLECTION,
  DELETE_STYLE_COLLECTION,
} from "@/graphql/lesson";

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
}: SlideToolbarProps) {
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);

  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [updateCollection] = useMutation(UPDATE_STYLE_COLLECTION);
  const [deleteCollection, { loading: deleting }] = useMutation(
    DELETE_STYLE_COLLECTION,
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
          <Select
            placeholder="Select group"
            value={selectedGroupId}
            onChange={(e) =>
              onSelectGroup(
                e.target.value === "" ? "" : parseInt(e.target.value, 10)
              )
            }
          >
            {styleGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
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
            setIsAddCollectionOpen(false);
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
          setIsEditCollectionOpen(false);
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
    </>
  );
}

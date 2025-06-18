"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  CREATE_STYLE_COLLECTION,
  UPDATE_STYLE_COLLECTION,
  DELETE_STYLE_COLLECTION,
} from "@/graphql/lesson";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import AddStyleCollectionModal from "@/components/lesson/modals/AddStyleCollectionModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface StyleCollectionManagementProps {
  onSelectCollection: (id: number | null) => void;
  selectedId?: number | null;
}

export default function StyleCollectionManagement({
  onSelectCollection,
  selectedId,
}: StyleCollectionManagementProps) {
  const { data, refetch } = useQuery(GET_STYLE_COLLECTIONS);
  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [updateCollection] = useMutation(UPDATE_STYLE_COLLECTION);
  const [deleteCollection, { loading: deleting }] = useMutation(
    DELETE_STYLE_COLLECTION
  );

  const [collections, setCollections] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedState, setSelectedState] = useState<number | "">("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (selectedState) {
      onSelectCollection(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (data?.getAllStyleCollection) {
      setCollections(
        data.getAllStyleCollection.map((c: any) => ({
          id: Number(c.id),
          name: c.name,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (selectedId !== undefined) {
      setSelectedState(selectedId === null ? "" : selectedId);
    }
  }, [selectedId]);

  const selected = collections.find((c) => c.id === selectedState);
  const options = collections.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  return (
    <Flex flex={1} p={4} w="100%" direction="column" align="start">
      <Text fontSize="sm" mb={2}>Style Collections</Text>
      <CrudDropdown
        options={options}
        value={selectedState}
        onChange={(e) =>
          setSelectedState(
            e.target.value === "" ? "" : parseInt(e.target.value, 10)
          )
        }
        onCreate={() => setIsAddOpen(true)}
        onUpdate={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={selectedState === ""}
        isDeleteDisabled={selectedState === ""}
      />

      <AddStyleCollectionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={async (name) => {
          const { data: res } = await createCollection({
            variables: { data: { name } },
          });
          const created = res?.createStyleCollection;
          if (created) {
            const coll = { id: Number(created.id), name: created.name };
            setCollections((c) => [...c, coll]);
            setSelectedState(coll.id);
            refetch();
          }
        }}
      />

      <AddStyleCollectionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Style Collection"
        confirmLabel="Update"
        initialName={selected?.name ?? ""}
        onSave={async (name) => {
          if (selectedState === "") return;
          const { data: res } = await updateCollection({
            variables: { data: { id: selectedState, name } },
          });
          const updated = res?.updateStyleCollection;
          if (updated) {
            setCollections((cs) =>
              cs.map((c) =>
                c.id === selectedState ? { id: c.id, name: updated.name } : c
              )
            );
            refetch();
          }
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete collection"
        bodyText="Are you sure you want to delete this collection?"
        onConfirm={async () => {
          if (selectedState === "") return;
          await deleteCollection({ variables: { data: { id: selectedState } } });
          setCollections((cs) => cs.filter((c) => c.id !== selectedState));
          setSelectedState("");
          setIsDeleteOpen(false);
          refetch();
        }}
        isLoading={deleting}
      />
    </Flex>
  );
}

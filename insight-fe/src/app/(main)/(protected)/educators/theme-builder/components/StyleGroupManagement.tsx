"use client";

import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import {
  GET_STYLE_GROUPS,
  CREATE_STYLE_GROUP,
  UPDATE_STYLE_GROUP,
  DELETE_STYLE_GROUP,
} from "@/graphql/lesson";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import AddStyleGroupModal from "@/components/lesson/modals/AddStyleGroupModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface StyleGroupManagementProps {
  collectionId: number | null;
  elementType: string | null;
}

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};

export default function StyleGroupManagement({
  collectionId,
  elementType,
}: StyleGroupManagementProps) {
  const { data, refetch } = useQuery(GET_STYLE_GROUPS, {
    variables: {
      collectionId: String(collectionId),
      element: elementType as string,
    },
    skip: collectionId === null || !elementType,
    fetchPolicy: "network-only",
  });

  const [createGroup] = useMutation(CREATE_STYLE_GROUP);
  const [updateGroup] = useMutation(UPDATE_STYLE_GROUP);
  const [deleteGroup, { loading: deleting }] = useMutation(DELETE_STYLE_GROUP);

  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (data?.getAllStyleGroup) {
      setGroups(
        data.getAllStyleGroup.map((g: any) => ({
          id: Number(g.id),
          name: g.name,
        }))
      );
    } else {
      setGroups([]);
    }
  }, [data]);

  useEffect(() => {
    setSelectedId("");
  }, [collectionId, elementType]);

  const selected = groups.find((g) => g.id === selectedId);
  const options = groups.map((g) => ({ label: g.name, value: String(g.id) }));
  const isDisabled = collectionId === null || !elementType;

  return (
    <Flex flex={1} p={4} w="100%">
      <CrudDropdown
        options={options}
        value={selectedId}
        onChange={(e) =>
          setSelectedId(
            e.target.value === "" ? "" : parseInt(e.target.value, 10)
          )
        }
        onCreate={() => setIsAddOpen(true)}
        onUpdate={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={selectedId === ""}
        isDeleteDisabled={selectedId === ""}
        isCreateDisabled={isDisabled}
        isDisabled={isDisabled}
      />

      <AddStyleGroupModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={async (name) => {
          if (collectionId === null || !elementType) return;
          const { data: res } = await createGroup({
            variables: {
              data: {
                name,
                collectionId,
                element: ELEMENT_TYPE_TO_ENUM[elementType],
              },
            },
          });
          const created = res?.createStyleGroup;
          if (created) {
            const group = { id: Number(created.id), name: created.name };
            setGroups((gs) => [...gs, group]);
            setSelectedId(group.id);
            refetch();
          }
        }}
      />

      <AddStyleGroupModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Style Group"
        confirmLabel="Update"
        initialName={selected?.name ?? ""}
        onSave={async (name) => {
          if (selectedId === "" || collectionId === null || !elementType) return;
          const { data: res } = await updateGroup({
            variables: {
              data: {
                id: selectedId,
                name,
                collectionId,
                element: ELEMENT_TYPE_TO_ENUM[elementType],
              },
            },
          });
          const updated = res?.updateStyleGroup;
          if (updated) {
            setGroups((gs) =>
              gs.map((g) => (g.id === selectedId ? { id: g.id, name: updated.name } : g))
            );
            refetch();
          }
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete group"
        bodyText="Are you sure you want to delete this group?"
        onConfirm={async () => {
          if (selectedId === "") return;
          await deleteGroup({ variables: { data: { id: selectedId } } });
          setGroups((gs) => gs.filter((g) => g.id !== selectedId));
          setSelectedId("");
          setIsDeleteOpen(false);
          refetch();
        }}
        isLoading={deleting}
      />
    </Flex>
  );
}

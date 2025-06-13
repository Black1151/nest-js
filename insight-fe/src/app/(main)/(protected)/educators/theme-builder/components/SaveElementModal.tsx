"use client";
import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { GET_STYLE_GROUPS } from "@/graphql/lesson";
import { BaseModal } from "@/components/modals/BaseModal";

interface SaveElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: number;
  elementType: string;
  onSave: (data: { name: string; groupId: number | null }) => void;
}

export default function SaveElementModal({
  isOpen,
  onClose,
  collectionId,
  elementType,
  onSave,
}: SaveElementModalProps) {
  const { data } = useQuery(GET_STYLE_GROUPS, {
    variables: { collectionId: String(collectionId), element: elementType },
    skip: !isOpen,
    fetchPolicy: "network-only",
  });
  const groups = data?.getAllStyleGroup ?? [];
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState<number | "">("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setGroupId("");
    }
  }, [isOpen]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Save Style">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Style Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Group</FormLabel>
          <Select
            placeholder="Select group"
            value={groupId}
            onChange={(e) =>
              setGroupId(e.target.value === "" ? "" : parseInt(e.target.value, 10))
            }
          >
            {groups.map((g: any) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={!name}
          onClick={() => {
            onSave({ name, groupId: groupId === "" ? null : groupId });
          }}
        >
          Save
        </Button>
      </Stack>
    </BaseModal>
  );
}

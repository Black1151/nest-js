"use client";
import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface SaveElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: string;
  onSave: (data: { name: string }) => void;
}

export default function SaveElementModal({
  isOpen,
  onClose,
  elementType,
  onSave,
}: SaveElementModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
    }
  }, [isOpen]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Save Style">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Style Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={!name}
          onClick={() => {
            onSave({ name });
          }}
        >
          Save
        </Button>
      </Stack>
    </BaseModal>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface SaveThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
}

export default function SaveThemeModal({
  isOpen,
  onClose,
  onSave,
  initialName = "",
}: SaveThemeModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Save Theme">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Theme Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={!name}
          onClick={() => {
            onSave(name);
          }}
        >
          Save
        </Button>
      </Stack>
    </BaseModal>
  );
}

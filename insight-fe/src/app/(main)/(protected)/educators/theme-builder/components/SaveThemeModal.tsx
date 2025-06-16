"use client";
import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface SaveThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveThemeModal({
  isOpen,
  onClose,
  onSave,
}: SaveThemeModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
    }
  }, [isOpen]);

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

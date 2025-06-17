"use client";
import { Stack, Button } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface StartThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  onLoad: () => void;
}

export default function StartThemeModal({
  isOpen,
  onClose,
  onCreate,
  onLoad,
}: StartThemeModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Start Theme Builder">
      <Stack spacing={4}>
        <Button colorScheme="blue" onClick={onCreate} data-testid="create-new">
          Create New Theme
        </Button>
        <Button onClick={onLoad} data-testid="modify-existing">
          Modify Existing Theme
        </Button>
      </Stack>
    </BaseModal>
  );
}

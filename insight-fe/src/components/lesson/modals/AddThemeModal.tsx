import { useState, useEffect } from "react";
import { Button, HStack, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface AddThemeModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  /** Pre-populated theme name when editing */
  initialName?: string;
  /** Modal title */
  title?: string;
  /** Confirmation button label */
  confirmLabel?: string;
}

export default function AddThemeModal({
  isOpen,
  onSave,
  onClose,
  initialName = "",
  title = "Add Theme",
  confirmLabel = "Save",
}: AddThemeModalProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onSave(name);
                if (initialName === "") {
                  setName("");
                }
                onClose();
              } finally {
                setLoading(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <Input
        placeholder="Theme name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </BaseModal>
  );
}

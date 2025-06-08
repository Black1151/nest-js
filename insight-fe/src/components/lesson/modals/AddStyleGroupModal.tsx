import { useState, useEffect } from "react";
import { Button, HStack, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface AddStyleGroupModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  /** Pre-populated name when editing an existing group */
  initialName?: string;
  /** Modal title, defaults to "Add Style Group" */
  title?: string;
  /** Text displayed on the confirmation button */
  confirmLabel?: string;
}

export default function AddStyleGroupModal({
  isOpen,
  onSave,
  onClose,
  initialName = "",
  title = "Add Style Group",
  confirmLabel = "Save",
}: AddStyleGroupModalProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  // Reset name whenever the modal is opened or the initial value changes
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
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </BaseModal>
  );
}

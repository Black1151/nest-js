import { useState, useEffect } from "react";
import { Button, HStack, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface AddStyleCollectionModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  /** Pre-populated name when editing an existing collection */
  initialName?: string;
  /** Modal title, defaults to "Add Style Collection" */
  title?: string;
  /** Text displayed on the confirmation button */
  confirmLabel?: string;
}

export default function AddStyleCollectionModal({
  isOpen,
  onSave,
  onClose,
  initialName = "",
  title = "Add Style Collection",
  confirmLabel = "Save",
}: AddStyleCollectionModalProps) {
  const [name, setName] = useState(initialName);

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
            onClick={() => {
              onSave(name);
              if (initialName === "") {
                setName("");
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
        placeholder="Collection name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </BaseModal>
  );
}

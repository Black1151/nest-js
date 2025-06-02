import { useState } from "react";
import { Button, HStack, Input } from "@chakra-ui/react";
import { BaseModal } from "../modals/BaseModal";

interface AddStyleCollectionModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function AddStyleCollectionModal({
  isOpen,
  onSave,
  onClose,
}: AddStyleCollectionModalProps) {
  const [name, setName] = useState("");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Style Collection"
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            onClick={() => {
              onSave(name);
              setName("");
            }}
          >
            Save
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

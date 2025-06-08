import { useState } from "react";
import { Button, HStack, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface AddStyleGroupModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function AddStyleGroupModal({
  isOpen,
  onSave,
  onClose,
}: AddStyleGroupModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Style Group"
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onSave(name);
                setName("");
                onClose();
              } finally {
                setLoading(false);
              }
            }}
          >
            Save
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

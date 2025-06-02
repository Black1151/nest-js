import { useState } from "react";
import { Button, Select, Stack } from "@chakra-ui/react";
import { BaseModal } from "../modals/BaseModal";
import AddStyleCollectionModal from "./AddStyleCollectionModal";

interface SaveStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: string[];
  onAddCollection: (name: string) => void;
}

export default function SaveStyleModal({
  isOpen,
  onClose,
  collections,
  onAddCollection,
}: SaveStyleModalProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="Save Style">
        <Stack spacing={4}>
          <Select placeholder="Select collection">
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Button onClick={() => setIsAddOpen(true)}>Add Collection</Button>
        </Stack>
      </BaseModal>
      <AddStyleCollectionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(name) => {
          onAddCollection(name);
          setIsAddOpen(false);
        }}
      />
    </>
  );
}

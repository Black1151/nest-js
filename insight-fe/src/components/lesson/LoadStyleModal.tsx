import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
} from "@chakra-ui/react";
import { BaseModal } from "../modals/BaseModal";

interface LoadStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Style collections available for loading */
  collections: { id: number; name: string }[];
  /** Callback executed when user chooses a collection */
  onLoad: (collectionId: number) => void;
}

export default function LoadStyleModal({
  isOpen,
  onClose,
  collections,
  onLoad,
}: LoadStyleModalProps) {
  const [collectionId, setCollectionId] = useState<number | "">("");

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Load Style">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Collection</FormLabel>
          <Select
            placeholder="Select collection"
            value={collectionId}
            onChange={(e) => setCollectionId(parseInt(e.target.value))}
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={collectionId === ""}
          onClick={() => {
            if (collectionId !== "") {
              onLoad(collectionId);
              setCollectionId("");
              onClose();
            }
          }}
        >
          Load
        </Button>
      </Stack>
    </BaseModal>
  );
}

import { useState } from "react";
import {
  Button,
  Select,
  Stack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { BaseModal } from "../modals/BaseModal";
import AddStyleCollectionModal from "./AddStyleCollectionModal";

interface SaveStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Available style collections. Each entry contains an id and name so that the
   * selected id can be sent to the backend style module.
   */
  collections: { id: number; name: string }[];
  /**
   * Whether the collections are still loading from the server.
   * When true, show a loading indicator in the dropdown.
   */
  isLoading?: boolean;
  /** Callback when the user adds a new collection */
  onAddCollection: (name: string) => void;
  /** Type of the element whose style is being saved */
  element: string;
  /** Callback executed when user submits the form */
  onSave: (data: { name: string; collectionId: number }) => void;
}

export default function SaveStyleModal({
  isOpen,
  onClose,
  collections,
  isLoading = false,
  onAddCollection,
  element,
  onSave,
}: SaveStyleModalProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState<number | "">("");

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="Save Style">
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Style Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Element</FormLabel>
            <Input value={element} isReadOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Collection</FormLabel>
            <Select
              value={collectionId}
              onChange={(e) => setCollectionId(parseInt(e.target.value))}
            >
              {isLoading && <option value="">Loading...</option>}
              {!isLoading && (
                <option key="__empty" value="">
                  ─ select ─
                </option>
              )}
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button onClick={() => setIsAddOpen(true)}>Add Collection</Button>
          <Button
            colorScheme="blue"
            isDisabled={!name || collectionId === ""}
            onClick={() => {
              if (collectionId !== "") {
                onSave({ name, collectionId });
                setName("");
                setCollectionId("");
                onClose();
              }
            }}
          >
            Save
          </Button>
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

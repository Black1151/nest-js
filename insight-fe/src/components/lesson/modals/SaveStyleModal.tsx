import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { BaseModal } from "../../modals/BaseModal";
import AddStyleCollectionModal from "./AddStyleCollectionModal";
import AddStyleGroupModal from "./AddStyleGroupModal";
import { CREATE_STYLE_GROUP } from "@/graphql/lesson";

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};

const CREATE_STYLE_COLLECTION = gql`
  mutation CreateStyleCollection($data: CreateStyleCollectionInput!) {
    createStyleCollection(data: $data) {
      id
      name
    }
  }
`;

interface SaveStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Available style collections. Each entry contains an id and name so that the
   * selected id can be sent to the backend style module.
   */
  collections?: { id: number; name: string }[];
  collectionId?: number;
  /** Currently selected element type for filtering groups */
  elementType: string | null;
  /** Groups available for the selected collection/element */
  groups: { id: number; name: string }[];
  /** Callback when the user adds a new collection */
  onAddCollection?: (collection: { id: number; name: string }) => void;
  /** Callback when user creates a new group */
  onAddGroup?: (group: { id: number; name: string }) => void;
  /** Callback executed when user submits the form */
  onSave: (data: {
    name: string;
    collectionId: number;
    groupId: number | null;
    asVariant: boolean;
  }) => void;
}

export default function SaveStyleModal({
  isOpen,
  onClose,
  collections,
  collectionId,
  elementType,
  groups,
  onAddCollection,
  onAddGroup,
  onSave,
}: SaveStyleModalProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [name, setName] = useState("");
  const [collectionIdState, setCollectionIdState] = useState<number | "">(
    collectionId ?? "",
  );
  const [groupId, setGroupId] = useState<number | "">("");
  const [asVariant, setAsVariant] = useState(false);
  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [createGroup] = useMutation(CREATE_STYLE_GROUP);

  useEffect(() => {
    setGroupId("");
  }, [collectionIdState, elementType]);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="Save Style">
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Style Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          {collections && (
            <FormControl>
              <FormLabel>Collection</FormLabel>
              <Select
                placeholder="Select collection"
                value={collectionIdState}
                onChange={(e) =>
                  setCollectionIdState(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl isDisabled={(collections ? collectionIdState === "" : false) || !elementType}>
            <FormLabel>Group</FormLabel>
            <Select
              placeholder="Select group"
              value={groupId}
              onChange={(e) =>
                setGroupId(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>
          </FormControl>
          {onAddCollection && (
            <Button onClick={() => setIsAddOpen(true)}>Add Collection</Button>
          )}
          {onAddGroup && (
            <Button onClick={() => setIsAddGroupOpen(true)} isDisabled={(collections ? collectionIdState === "" : false) || !elementType}>
              Add Group
            </Button>
          )}
          <Checkbox
            isChecked={asVariant}
            onChange={(e) => setAsVariant(e.target.checked)}
          >
            Save as Variant
          </Checkbox>
          <Button
            colorScheme="blue"
            isDisabled={!name || (collections ? collectionIdState === "" : false)}
            onClick={() => {
              if (!collections || collectionIdState !== "") {
                onSave({
                  name,
                  collectionId: collections ? Number(collectionIdState) : (collectionId as number),
                  groupId: groupId === "" ? null : groupId,
                  asVariant,
                });
                setName("");
                if (collections) setCollectionIdState("");
                setGroupId("");
                setAsVariant(false);
                onClose();
              }
            }}
          >
            Save
          </Button>
        </Stack>
      </BaseModal>
      {onAddCollection && (
        <AddStyleCollectionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={async (name) => {
            const { data } = await createCollection({
              variables: { data: { name } },
            });
            if (data?.createStyleCollection) {
              onAddCollection({
                id: data.createStyleCollection.id,
                name: data.createStyleCollection.name,
              });
            }
            setIsAddOpen(false);
          }}
        />
      )}
      {onAddGroup && (
        <AddStyleGroupModal
          isOpen={isAddGroupOpen}
          onClose={() => setIsAddGroupOpen(false)}
          onSave={async (name) => {
            if ((collections ? collectionIdState === "" : false) || !elementType) return;
            const { data } = await createGroup({
              variables: {
                data: {
                  name,
                  collectionId: collections ? Number(collectionIdState) : (collectionId as number),
                  element: ELEMENT_TYPE_TO_ENUM[elementType],
                },
              },
            });
            if (data?.createStyleGroup) {
              onAddGroup({
                id: data.createStyleGroup.id,
                name: data.createStyleGroup.name,
              });
            }
            setIsAddGroupOpen(false);
          }}
        />
      )}
    </>
  );
}

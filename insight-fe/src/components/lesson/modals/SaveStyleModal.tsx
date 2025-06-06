import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Stack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { BaseModal } from "../../modals/BaseModal";
import AddStyleCollectionModal from "./AddStyleCollectionModal";
import AddStyleGroupModal from "./AddStyleGroupModal";
import { GET_STYLE_GROUPS, CREATE_STYLE_GROUP } from "@/graphql/lesson";

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
  collections: { id: number; name: string }[];
  /** Currently selected element type for filtering groups */
  elementType: string | null;
  /** Callback when the user adds a new collection */
  onAddCollection: (collection: { id: number; name: string }) => void;
  /** Callback executed when user submits the form */
  onSave: (data: {
    name: string;
    collectionId: number;
    groupId: number | null;
  }) => void;
}

export default function SaveStyleModal({
  isOpen,
  onClose,
  collections,
  elementType,
  onAddCollection,
  onSave,
}: SaveStyleModalProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState<number | "">("");
  const [groupId, setGroupId] = useState<number | "">("");
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [createGroup] = useMutation(CREATE_STYLE_GROUP);

  const { data: groupData, refetch: refetchGroups } = useQuery(GET_STYLE_GROUPS, {
    variables:
      collectionId !== "" && elementType
        ? { collectionId: String(collectionId), element: elementType }
        : undefined,
    skip: collectionId === "" || !elementType,
  });

  useEffect(() => {
    if (groupData?.getAllStyleGroup) {
      setGroups(groupData.getAllStyleGroup);
    } else {
      setGroups([]);
    }
  }, [groupData]);

  useEffect(() => {
    setGroupId("");
  }, [collectionId, elementType]);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="Save Style">
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Style Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Collection</FormLabel>
            <Select
              placeholder="Select collection"
              value={collectionId}
              onChange={(e) =>
                setCollectionId(
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
          <FormControl isDisabled={collectionId === "" || !elementType}>
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
          <Button onClick={() => setIsAddOpen(true)}>Add Collection</Button>
          <Button onClick={() => setIsAddGroupOpen(true)} isDisabled={collectionId === "" || !elementType}>
            Add Group
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={!name || collectionId === ""}
            onClick={() => {
              if (collectionId !== "") {
                onSave({
                  name,
                  collectionId,
                  groupId: groupId === "" ? null : groupId,
                });
                setName("");
                setCollectionId("");
                setGroupId("");
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
      <AddStyleGroupModal
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
        onSave={async (name) => {
          if (collectionId === "" || !elementType) return;
          const { data } = await createGroup({
            variables: {
              data: {
                name,
                collectionId,
                element: elementType,
              },
            },
          });
          if (data?.createStyleGroup) {
            await refetchGroups();
          }
          setIsAddGroupOpen(false);
        }}
      />
    </>
  );
}

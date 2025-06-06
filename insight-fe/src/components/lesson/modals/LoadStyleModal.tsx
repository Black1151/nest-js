import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { BaseModal } from "@/components/modals/BaseModal";

const GET_STYLES = gql`
  query GetStyles($collectionId: String!, $element: String!, $groupId: String) {
    getAllStyle(
      data: {
        all: true
        filters: [
          { column: "collectionId", value: $collectionId }
          { column: "element", value: $element }
          { column: "groupId", value: $groupId }
        ]
      }
    ) {
      id
      name
    }
  }
`;

interface LoadStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Style collections available for loading */
  collections: { id: number; name: string }[];
  /** Element type for filtering styles */
  elementType: string | null;
  /** Groups for the selected collection/element */
  groups: { id: number; name: string }[];
  /** Callback executed when user chooses a style */
  onLoad: (styleId: number) => void;
}

export default function LoadStyleModal({
  isOpen,
  onClose,
  collections,
  elementType,
  groups,
  onLoad,
}: LoadStyleModalProps) {
  const [collectionId, setCollectionId] = useState<number | "">("");
  const [groupId, setGroupId] = useState<number | "">("");
  const [styleId, setStyleId] = useState<number | "">("");
  const [styles, setStyles] = useState<{ id: number; name: string }[]>([]);

  const { data: stylesData } = useQuery(GET_STYLES, {
    variables:
      collectionId !== "" && elementType
        ? {
            collectionId: String(collectionId),
            element: elementType,
            groupId: groupId === "" ? null : String(groupId),
          }
        : undefined,
    skip: collectionId === "" || !elementType,
  });


  useEffect(() => {
    if (stylesData?.getAllStyle) {
      setStyles(stylesData.getAllStyle);
    } else {
      setStyles([]);
    }
  }, [stylesData]);


  useEffect(() => {
    setStyleId("");
    setGroupId("");
  }, [collectionId, elementType]);

  useEffect(() => {
    setStyleId("");
  }, [groupId]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Load Style">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Collection</FormLabel>
          <Select
            placeholder="Select collection"
            value={collectionId}
            onChange={(e) => {
              const val = e.target.value;
              setCollectionId(val === "" ? "" : parseInt(val, 10));
            }}
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
            onChange={(e) => {
              const val = e.target.value;
              setGroupId(val === "" ? "" : parseInt(val, 10));
            }}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isDisabled={collectionId === "" || !elementType || groupId === ""}>
          <FormLabel>Style</FormLabel>
          <Select
            placeholder="Select style"
            value={styleId}
            onChange={(e) => {
              const val = e.target.value;
              setStyleId(val === "" ? "" : parseInt(val, 10));
            }}
          >
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={styleId === ""}
          onClick={() => {
            if (styleId !== "") {
              onLoad(styleId);
              setStyleId("");
              setCollectionId("");
              setGroupId("");
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

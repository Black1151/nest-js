import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { BaseModal } from "../modals/BaseModal";

const GET_STYLES = gql`
  query GetStyles($collectionId: String!, $element: String!) {
    getAllStyle(
      data: {
        all: true
        filters: [
          { column: "collectionId", value: $collectionId }
          { column: "element", value: $element }
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
  /** Callback executed when user chooses a style */
  onLoad: (styleId: number) => void;
}

export default function LoadStyleModal({
  isOpen,
  onClose,
  collections,
  elementType,
  onLoad,
}: LoadStyleModalProps) {
  const [collectionId, setCollectionId] = useState<number | "">("");
  const [styleId, setStyleId] = useState<number | "">("");
  const [styles, setStyles] = useState<{ id: number; name: string }[]>([]);

  const { data: stylesData } = useQuery(GET_STYLES, {
    variables:
      collectionId !== "" && elementType
        ? { collectionId: String(collectionId), element: elementType }
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
  }, [collectionId]);

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
        <FormControl isDisabled={collectionId === ""}>
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

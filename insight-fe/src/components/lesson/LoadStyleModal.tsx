import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { BaseModal } from "../modals/BaseModal";

const GET_STYLES = gql`
  query GetStyles($collectionId: ID!, $element: String!) {
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
      config
    }
  }
`;

interface LoadStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: { id: number; name: string }[];
  element: string;
  onLoad: (config: any) => void;
}

export default function LoadStyleModal({
  isOpen,
  onClose,
  collections,
  element,
  onLoad,
}: LoadStyleModalProps) {
  const [collectionId, setCollectionId] = useState<number | "">("");
  const [styleId, setStyleId] = useState<number | "">("");

  const { data } = useQuery(GET_STYLES, {
    variables: { collectionId, element },
    skip: collectionId === "",
  });

  const styles: { id: number; name: string; config: any }[] =
    data?.getAllStyle || [];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Load Style"
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            onClick={() => {
              const style = styles.find((s) => s.id === styleId);
              if (style) {
                onLoad(style.config);
                setCollectionId("");
                setStyleId("");
                onClose();
              }
            }}
            isDisabled={styleId === ""}
          >
            Load Style
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Collection</FormLabel>
          <Select
            placeholder="Select collection"
            value={collectionId}
            onChange={(e) => {
              setCollectionId(parseInt(e.target.value));
              setStyleId("");
            }}
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Style</FormLabel>
          <Select
            placeholder="Select style"
            value={styleId}
            onChange={(e) => setStyleId(parseInt(e.target.value))}
            isDisabled={collectionId === ""}
          >
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </BaseModal>
  );
}

"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";

import {
  GET_STYLE_GROUPS,
} from "@/graphql/lesson";
import SimpleDropdown from "@/components/dropdowns/SimpleDropdown";

interface StyleGroupManagementProps {
  collectionId: number | null;
  elementType: string | null;
  onSelectGroup?: (id: number | null) => void;
}


export default function StyleGroupManagement({
  collectionId,
  elementType,
  onSelectGroup,
}: StyleGroupManagementProps) {
  const { data, loading } = useQuery(GET_STYLE_GROUPS, {
    variables: {
      collectionId: String(collectionId),
      element: elementType as string,
    },
    skip: collectionId === null || !elementType,
    fetchPolicy: "network-only",
  });

  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");

  useEffect(() => {
    onSelectGroup?.(selectedId === "" ? null : selectedId);
  }, [selectedId, onSelectGroup]);

  useEffect(() => {
    if (data?.getAllStyleGroup) {
      setGroups(
        data.getAllStyleGroup.map((g: any) => ({
          id: Number(g.id),
          name: g.name,
        }))
      );
    } else {
      setGroups([]);
    }
  }, [data]);

  useEffect(() => {
    setSelectedId("");
  }, [collectionId, elementType]);

  const options = useMemo(
    () => groups.map((g) => ({ label: g.name, value: String(g.id) })),
    [groups]
  );
  const isDisabled = collectionId === null || !elementType;

  return (
    <Flex flex={1} p={4} w="100%" direction="column" align="start">
      <Text fontSize="sm" mb={2}>Style Groups</Text>
      <SimpleDropdown
        options={options}
        value={selectedId}
        onChange={(e) =>
          setSelectedId(
            e.target.value === "" ? "" : parseInt(e.target.value, 10)
          )
        }
        isDisabled={isDisabled}
        isLoading={loading}
      />
    </Flex>
  );
}

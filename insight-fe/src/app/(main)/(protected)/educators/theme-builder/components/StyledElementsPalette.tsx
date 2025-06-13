"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STYLES_WITH_CONFIG_BY_GROUP } from "@/graphql/lesson";
import DnDPalette from "@/components/DnD/DnDPalette";
import { VStack, Text } from "@chakra-ui/react";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";

interface StyledElementsPaletteProps {
  collectionId: number | null;
  elementType: string | null;
  groupId: number | null;
}

export default function StyledElementsPalette({
  collectionId,
  elementType,
  groupId,
}: StyledElementsPaletteProps) {
  const [items, setItems] = useState<SlideElementDnDItemProps[]>([]);
  const { data } = useQuery(GET_STYLES_WITH_CONFIG_BY_GROUP, {
    variables: {
      collectionId: String(collectionId),
      element: elementType ?? "",
      groupId: String(groupId),
    },
    skip: collectionId === null || !elementType || groupId === null,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (collectionId === null || !elementType || groupId === null) {
      setItems([]);
    }
  }, [collectionId, elementType, groupId]);

  useEffect(() => {
    if (data?.getAllStyle) {
      setItems(
        data.getAllStyle.map((s: any) => ({
          ...(s.config as SlideElementDnDItemProps),
          id: crypto.randomUUID(),
        }))
      );
    }
  }, [data]);

  return (
    <VStack align="start" w="100%">
      <Text fontSize="sm" mb={2}>Styled Elements</Text>
      <DnDPalette
        testId="styled"
        items={items}
        ItemComponent={SlideElementDnDItem}
        getDragData={(item) =>
          JSON.stringify({ type: item.type, config: item })
        }
      />
    </VStack>
  );
}

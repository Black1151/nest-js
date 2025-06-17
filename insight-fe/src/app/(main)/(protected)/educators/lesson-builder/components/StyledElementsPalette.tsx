"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STYLES_WITH_CONFIG } from "@/graphql/lesson";
import DnDPalette from "@/components/DnD/DnDPalette";
import { VStack, Text } from "@chakra-ui/react";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import type { BoardRow } from "@/components/lesson/slide/SlideElementsContainer";

interface StyledElementsPaletteProps {
  collectionId: number | null;
  elementType: string | null;
}

export default function StyledElementsPalette({
  collectionId,
  elementType,
}: StyledElementsPaletteProps) {
  const [items, setItems] = useState<
    (
      | SlideElementDnDItemProps
      | ColumnType<SlideElementDnDItemProps>
      | BoardRow
    )[]
  >([]);
  const { data } = useQuery(GET_STYLES_WITH_CONFIG, {
    variables: {
      collectionId: String(collectionId),
      element: elementType ?? "",
    },
    skip: collectionId === null || !elementType,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (collectionId === null || !elementType) {
      setItems([]);
    }
  }, [collectionId, elementType]);

  useEffect(() => {
    if (data?.getAllStyle) {
      const mapped = data.getAllStyle.map((s: any) => {
        const cfg = s.config as any;
        if (elementType === "column") {
          return { ...cfg, type: "column", id: crypto.randomUUID() };
        }
        if (elementType === "row") {
          return { ...cfg, type: "row", id: crypto.randomUUID() };
        }
        return {
          ...(cfg as SlideElementDnDItemProps),
          id: crypto.randomUUID(),
          styleId: Number(s.id),
        };
      });
      setItems(mapped);
    }
  }, [data, elementType]);

  return (
    <VStack align="start" w="100%">
      <Text fontSize="sm" mb={2}>
        Styled Elements
      </Text>
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

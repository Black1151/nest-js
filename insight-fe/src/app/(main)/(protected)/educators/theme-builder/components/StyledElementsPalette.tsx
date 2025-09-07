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
import { ColumnType } from "@/components/DnD/types";
import type { BoardRow } from "@/components/lesson/slide/SlideElementsContainer";

interface StyledElementsPaletteProps {
  collectionId: number | null;
  elementType: string | null;
  groupId: number | null;
  /**
   * Map of style updates keyed by styleId. When provided, the palette will
   * update the corresponding element configuration without refetching from
   * the server.
   */
  styleUpdates?: Record<number, SlideElementDnDItemProps>;
}

export default function StyledElementsPalette({
  collectionId,
  elementType,
  groupId,
  styleUpdates,
}: StyledElementsPaletteProps) {
  const [items, setItems] = useState<
    (
      | SlideElementDnDItemProps
      | ColumnType<SlideElementDnDItemProps>
      | BoardRow
    )[]
  >([]);
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

  // Apply style updates coming from the canvas
  useEffect(() => {
    if (!styleUpdates) return;
    setItems((prev) =>
      prev.map((item) => {
        const styleId = (item as any).styleId as number | undefined;
        if (styleId && styleUpdates[styleId]) {
          const { id: _ignore, ...rest } = styleUpdates[styleId];
          return { ...item, ...rest, id: item.id } as typeof item;
        }
        return item;
      }),
    );
  }, [styleUpdates]);

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

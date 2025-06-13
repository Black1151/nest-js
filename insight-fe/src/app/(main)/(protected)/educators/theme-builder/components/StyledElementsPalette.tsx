"use client";

import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_STYLES_WITH_CONFIG_BY_GROUP } from "@/graphql/lesson";
import DnDPalette from "@/components/DnD/DnDPalette";
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
  const [fetchStyles, { data }] = useLazyQuery(GET_STYLES_WITH_CONFIG_BY_GROUP, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (collectionId !== null && elementType && groupId !== null) {
      fetchStyles({
        variables: {
          collectionId: String(collectionId),
          element: elementType,
          groupId: String(groupId),
        },
      });
    } else {
      setItems([]);
    }
  }, [collectionId, elementType, groupId, fetchStyles]);

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
    <DnDPalette
      testId="styled"
      items={items}
      ItemComponent={SlideElementDnDItem}
      getDragData={(item) => JSON.stringify({ type: item.type, config: item })}
    />
  );
}

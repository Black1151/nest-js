"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_STYLES_WITH_CONFIG, DELETE_STYLE } from "@/graphql/lesson";
import DnDPalette from "@/components/DnD/DnDPalette";
import { VStack, Text, HStack } from "@chakra-ui/react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import type { BoardRow } from "@/components/lesson/slide/SlideElementsContainer";
import StyleDeleteDropArea from "./StyleDeleteDropArea";

interface StyledElementsPaletteProps {
  collectionId: number | null;
  elementType: string | null;
  refreshKey?: number;
}

export default function StyledElementsPalette({
  collectionId,
  elementType,
  refreshKey,
}: StyledElementsPaletteProps) {
  const [items, setItems] = useState<
    (
      | SlideElementDnDItemProps
      | ColumnType<SlideElementDnDItemProps>
      | BoardRow
    )[]
  >([]);
  const shouldSkip = collectionId === null || !elementType;
  const { data, refetch } = useQuery(GET_STYLES_WITH_CONFIG, {
    variables: {
      collectionId: String(collectionId),
      element: elementType ?? "",
    },
    skip: shouldSkip,
    fetchPolicy: "network-only",
  });
  const [deleteStyle] = useMutation(DELETE_STYLE);
  const [styleIdToDelete, setStyleIdToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (collectionId === null || !elementType) {
      setItems([]);
    }
  }, [collectionId, elementType]);

  useEffect(() => {
    if (!shouldSkip && refreshKey !== undefined) {
      refetch();
    }
  }, [refreshKey, shouldSkip, refetch]);

  useEffect(() => {
    if (data?.getAllStyle) {
      const mapped = data.getAllStyle.map((s: any) => {
        const cfg = s.config as any;
        const base = {
          ...(cfg as SlideElementDnDItemProps),
          id: cfg.id,
          styleId: Number(s.id),
          styleName: s.name,
        } as SlideElementDnDItemProps;
        if (elementType === "column") {
          return { ...base, type: "column" };
        }
        if (elementType === "row") {
          return { ...base, type: "row" };
        }
        return { ...base };
      });
      setItems(mapped);
    }
  }, [data, elementType]);

  const handleRequestDelete = (id: number) => setStyleIdToDelete(id);

  const confirmDelete = async () => {
    if (styleIdToDelete === null) return;
    setDeleting(true);
    await deleteStyle({ variables: { data: { id: styleIdToDelete } } });
    setItems((prev) => prev.filter((it) => it.styleId !== styleIdToDelete));
    setDeleting(false);
    setStyleIdToDelete(null);
  };

  return (
    <VStack align="start" w="100%">
      <Text fontSize="sm" mb={2}>
        Styled Elements
      </Text>
      <HStack align="start" w="100%" spacing={4}>
        <DnDPalette
          testId="styled"
          items={items}
          ItemComponent={SlideElementDnDItem}
          getDragData={(item) =>
            JSON.stringify({ type: item.type, config: item })
          }
        />
        <StyleDeleteDropArea onDrop={handleRequestDelete} />
      </HStack>
      <ConfirmationModal
        isOpen={styleIdToDelete !== null}
        onClose={() => setStyleIdToDelete(null)}
        action="delete style"
        bodyText="Are you sure you want to delete this styled element?"
        onConfirm={confirmDelete}
        isLoading={deleting}
      />
    </VStack>
  );
}

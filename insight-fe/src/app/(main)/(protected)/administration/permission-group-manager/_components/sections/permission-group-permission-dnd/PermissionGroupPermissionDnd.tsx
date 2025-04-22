"use client";

import { ContentCard } from "@/components/layout/Card";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import { useQuery, useMutation, SubmitIdArrayByIdRequestDto } from "@/gqty";
import { Center, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import {
  NameAndDescriptionDnDItem,
  NameAndDescriptionDnDItemProps,
} from "@/components/DnD/cards/NameAndDescriptionDndCard";

interface PermissionGroupPermissionDndProps {
  groupId: number | null;
}

export const PermissionGroupPermissionDnd = ({
  groupId,
}: PermissionGroupPermissionDndProps) => {
  /* ---------- Early exit when no permission‑group ---------- */
  if (!groupId) {
    return (
      <ContentCard maxHeight={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No permission‑group selected</Text>
        </Center>
      </ContentCard>
    );
  }

  /* ---------- Queries ---------- */
  const query = useQuery();
  const allPermissions = query.getAllPermission({ data: { all: true } }) ?? [];

  const groupPermissionsRaw =
    query.getPermissionsForGroup({ data: { id: groupId } }) ?? [];

  /* ---------- Mutation ---------- */
  const [updatePermsForGroup, { isLoading }] = useMutation(
    (mutation, data: SubmitIdArrayByIdRequestDto) => {
      const updatedGroup = mutation.updatePermissionGroupPermissionsFromArray({
        data,
      });
      /* hydrate the selection set so cache is correct */
      updatedGroup.permissions?.forEach((p) => {
        p.id;
        p.name;
        p.description;
      });
    }
  );

  /* ---------- Transform to DnD items ---------- */
  const groupPermissionItems = useMemo<NameAndDescriptionDnDItemProps[]>(
    () =>
      groupPermissionsRaw.map((perm) => ({
        id: perm.id,
        name: perm.name,
        description: perm.description ?? "",
      })),
    [groupPermissionsRaw]
  );

  const availablePermissionItems = useMemo<NameAndDescriptionDnDItemProps[]>(
    () =>
      allPermissions
        .filter((perm) => !groupPermissionsRaw.some((gp) => gp.id === perm.id))
        .map((perm) => ({
          id: perm.id,
          name: perm.name,
          description: perm.description ?? "",
        })),
    [allPermissions, groupPermissionsRaw]
  );

  /* ---------- Column config ---------- */
  const columnMap: Record<
    string,
    ColumnType<NameAndDescriptionDnDItemProps>
  > = useMemo(
    () => ({
      groupPermissions: {
        title: "Group Permissions",
        sortBy: (item) => item.name,
        sortDirection: "asc",
        columnId: "groupPermissions",
        styles: {
          container: { border: "3px dashed teal", width: "100%" },
          header: { bg: "teal.600", color: "white" },
          card: { bg: "teal.100", _hover: { bg: "teal.200" } },
        },
        items: groupPermissionItems,
      },
      availablePermissions: {
        title: "Available Permissions",
        sortBy: (item) => item.name,
        sortDirection: "asc",
        columnId: "availablePermissions",
        styles: {
          container: { border: "3px dashed gray", width: "100%" },
          header: { bg: "gray.700", color: "white" },
          card: { bg: "gray.200", _hover: { bg: "gray.300" } },
        },
        items: availablePermissionItems,
      },
    }),
    [groupPermissionItems, availablePermissionItems]
  );

  const orderedColumnIds = ["groupPermissions", "availablePermissions"];

  /* ---------- Submit handler ---------- */
  const handleSubmit = useCallback(
    async (boardState: BoardState<NameAndDescriptionDnDItemProps>) => {
      const idArray = boardState.columnMap.groupPermissions.items.map((i) =>
        parseInt(i.id)
      );

      await updatePermsForGroup({
        args: { recordId: groupId, idArray },
      });

      await query.$refetch(true);
    },
    [groupId, updatePermsForGroup, query]
  );

  /* ---------- Render ---------- */
  return (
    <ContentCard>
      <DnDBoardMain<NameAndDescriptionDnDItemProps>
        columnMap={columnMap}
        orderedColumnIds={orderedColumnIds}
        CardComponent={NameAndDescriptionDnDItem}
        enableColumnReorder={false}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </ContentCard>
  );
};

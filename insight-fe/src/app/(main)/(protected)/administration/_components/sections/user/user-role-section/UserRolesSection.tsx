"use client";

import { ContentCard } from "@/components/layout/Card";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import {
  useQuery,
  useMutation,
  UpdateUserRolesFromArrayRequestDto,
} from "@/gqty";
import { RoleDnDItem, RoleDnDItemProps } from "./components/RoleDnDItem";
import { Center, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";

interface UserRolesSectionProps {
  publicId: string | null;
}

export const UserRolesSection = ({ publicId }: UserRolesSectionProps) => {
  /* ---------- Early exit when no user ---------- */
  if (!publicId) {
    return (
      <ContentCard height={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No user selected</Text>
        </Center>
      </ContentCard>
    );
  }

  /* ---------- Query hooks ---------- */
  const query = useQuery();
  const allRoles = query.getAllRole({ data: { all: true } }) ?? [];
  const userRolesRaw = query.getRolesForUser({ data: { publicId } }) ?? [];

  /* ---------- Mutation hook ---------- */
  const [updateUserRolesFromArray, { isLoading }] = useMutation(
    (mutation, data: UpdateUserRolesFromArrayRequestDto) => {
      const updatedUser = mutation.updateUserRolesFromArray({ data });
      updatedUser.roles?.forEach((r) => {
        r.id;
        r.name;
        r.description;
      });
    }
  );

  /* ---------- Transform to DnD items ---------- */
  const userRoleItems = useMemo<RoleDnDItemProps[]>(
    () =>
      userRolesRaw.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
    [userRolesRaw]
  );

  const availableRoleItems = useMemo<RoleDnDItemProps[]>(
    () =>
      allRoles
        .filter((role) => !userRolesRaw.some((ur) => ur.id === role.id))
        .map((role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
        })),
    [allRoles, userRolesRaw]
  );

  /* ---------- Board configuration ---------- */
  const columnMap: Record<string, ColumnType<RoleDnDItemProps>> = useMemo(
    () => ({
      userRoles: {
        title: "User Roles",
        columnId: "userRoles",
        styles: {
          container: { border: "3px dashed orange", width: "300px" },
          header: { bg: "orange.500", color: "white" },
          card: { bg: "orange.200", _hover: { bg: "orange.300" } },
        },
        items: userRoleItems,
      },
      availableRoles: {
        title: "Available Roles",
        columnId: "availableRoles",
        styles: {
          container: { border: "3px dashed purple", width: "300px" },
          header: { bg: "purple.700", color: "white" },
          card: { bg: "purple.200", _hover: { bg: "purple.300" } },
        },
        items: availableRoleItems,
      },
    }),
    [userRoleItems, availableRoleItems]
  );

  const orderedColumnIds = ["userRoles", "availableRoles"];

  /* ---------- Submit handler ---------- */
  const handleSubmit = useCallback(
    async (boardData: BoardState<RoleDnDItemProps>) => {
      const roleIds = boardData.columnMap.userRoles.items.map((item) =>
        parseInt(item.id)
      );

      // 1. Run the mutation (await so errors surface here)
      await updateUserRolesFromArray({
        args: { publicId, roleIds },
      });

      // 2. Hard‑refetch **and wait** so UI re‑renders with fresh data  :contentReference[oaicite:0]{index=0}
      await query.$refetch(true);
    },
    [publicId, updateUserRolesFromArray, query]
  );

  /* ---------- Render ---------- */
  return (
    <ContentCard>
      <DnDBoardMain<RoleDnDItemProps>
        columnMap={columnMap}
        orderedColumnIds={orderedColumnIds}
        CardComponent={RoleDnDItem}
        enableColumnReorder={false}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </ContentCard>
  );
};

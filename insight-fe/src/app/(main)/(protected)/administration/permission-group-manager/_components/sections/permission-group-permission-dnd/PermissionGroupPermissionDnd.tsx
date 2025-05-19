// PermissionGroupPermissionDnd.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import { Center, Text } from "@chakra-ui/react";
import { ContentCard } from "@/components/layout/Card";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import {
  NameAndDescriptionDnDItem,
  NameAndDescriptionDnDItemProps,
} from "@/components/DnD/cards/NameAndDescriptionDndCard";

import { useQuery, useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import {
  Permission,
  SubmitIdArrayByIdRequestDto,
} from "@/__generated__/schema-types";

/* --------------------------------------------------------------------------- */
/* GraphQL documents                                                           */
/* --------------------------------------------------------------------------- */

const GET_ALL_PERMISSIONS = typedGql("query")({
  getAllPermission: [
    { data: $("data", "FindAllInput!") }, // { all: true }
    { id: true, name: true, description: true },
  ],
} as const);

const GET_PERMISSIONS_FOR_GROUP = typedGql("query")({
  getPermissionsForGroup: [
    { data: $("data", "IdRequestDto!") }, // { id: Int! }
    { id: true, name: true, description: true },
  ],
} as const);

const UPDATE_GROUP_PERMISSIONS = typedGql("mutation")({
  updatePermissionGroupPermissionsFromArray: [
    { data: $("data", "SubmitIdArrayByIdRequestDto!") },
    {
      id: true,
      permissions: { id: true, name: true, description: true },
    },
  ],
} as const);

/* --------------------------------------------------------------------------- */
/* Component                                                                   */
/* --------------------------------------------------------------------------- */

interface PermissionGroupPermissionDndProps {
  groupId: number | null;
}

export function PermissionGroupPermissionDnd({
  groupId,
}: PermissionGroupPermissionDndProps) {
  /* --------------------------- Early-exit UI --------------------------- */
  if (!groupId) {
    return (
      <ContentCard maxHeight={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No permission-group selected</Text>
        </Center>
      </ContentCard>
    );
  }

  /* ------------------------------ Queries ------------------------------ */
  const {
    data: allPermsData,
    loading: loadingAll,
    error: errorAll,
  } = useQuery(GET_ALL_PERMISSIONS, { variables: { data: { all: true } } });

  const {
    data: groupPermsData,
    loading: loadingGroup,
    error: errorGroup,
    refetch: refetchGroupPerms,
  } = useQuery(GET_PERMISSIONS_FOR_GROUP, {
    variables: { data: { id: groupId } },
  });

  /* ------------------------------ Mutation ----------------------------- */
  const [updatePermsForGroup, { loading: mutating }] = useMutation(
    UPDATE_GROUP_PERMISSIONS,
    {
      refetchQueries: [
        {
          query: GET_PERMISSIONS_FOR_GROUP,
          variables: { data: { id: groupId } },
        },
        { query: GET_ALL_PERMISSIONS, variables: { data: { all: true } } },
      ],
    }
  );

  /* -------------------------- Derived state --------------------------- */
  const allPermissions = allPermsData?.getAllPermission ?? [];
  const groupPermissionsRaw = groupPermsData?.getPermissionsForGroup ?? [];

  const groupPermissionItems = useMemo<NameAndDescriptionDnDItemProps[]>(
    () =>
      groupPermissionsRaw.map((p) => ({
        id: String(p.id),
        name: p.name,
        description: p.description ?? "",
      })),
    [groupPermissionsRaw]
  );

  const availablePermissionItems = useMemo<NameAndDescriptionDnDItemProps[]>(
    () =>
      allPermissions
        .filter((p) => !groupPermissionsRaw.some((gp) => gp.id === p.id))
        .map((p) => ({
          id: String(p.id),
          name: p.name,
          description: p.description ?? "",
        })),
    [allPermissions, groupPermissionsRaw]
  );

  /* ----------------------- Column configuration ----------------------- */
  const columnMap: Record<
    string,
    ColumnType<NameAndDescriptionDnDItemProps>
  > = useMemo(
    () => ({
      groupPermissions: {
        title: "Group Permissions",
        columnId: "groupPermissions",
        styles: {
          container: { border: "3px dashed teal", width: "100%" },
          header: { bg: "teal.600", color: "white" },
          card: { bg: "teal.100", _hover: { bg: "teal.200" } },
        },
        sortBy: (i) => i.name,
        sortDirection: "asc",
        items: groupPermissionItems,
      },
      availablePermissions: {
        title: "Available Permissions",
        columnId: "availablePermissions",
        styles: {
          container: { border: "3px dashed gray", width: "100%" },
          header: { bg: "gray.700", color: "white" },
          card: { bg: "gray.200", _hover: { bg: "gray.300" } },
        },
        sortBy: (i) => i.name,
        sortDirection: "asc",
        items: availablePermissionItems,
      },
    }),
    [groupPermissionItems, availablePermissionItems]
  );

  const orderedColumnIds = ["groupPermissions", "availablePermissions"];

  /* --------------------------- Submit handler -------------------------- */
  const handleSubmit = useCallback(
    async (board: BoardState<NameAndDescriptionDnDItemProps>) => {
      const idArray = board.columnMap.groupPermissions.items.map((i) =>
        parseInt(i.id)
      );

      await updatePermsForGroup({
        variables: {
          data: {
            recordId: groupId,
            idArray,
          } as SubmitIdArrayByIdRequestDto,
        },
      });

      await refetchGroupPerms(); // ensures UI refresh
    },
    [groupId, updatePermsForGroup, refetchGroupPerms]
  );

  const isLoading = loadingAll || loadingGroup || mutating;

  /* ----------------------------- Errors ------------------------------- */
  if (errorAll || errorGroup) {
    return (
      <ContentCard maxHeight={700}>
        <Center flex={1}>
          <Text fontSize="lg" color="red.500">
            Failed to load permissions
          </Text>
        </Center>
      </ContentCard>
    );
  }

  /* ----------------------------- Render ------------------------------- */
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
}

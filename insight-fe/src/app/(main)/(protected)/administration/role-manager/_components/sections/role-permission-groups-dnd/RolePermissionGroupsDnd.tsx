// RolePermissionGroupsDnd.tsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
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
import { SubmitIdArrayByIdRequestDto } from "@/__generated__/schema-types";

/* -------------------------------------------------------------------------- */
/* GraphQL documents                                                          */
/* -------------------------------------------------------------------------- */

const GET_ALL_PERMISSION_GROUPS = typedGql("query")({
  getAllPermissionGroup: [
    { data: $("data", "FindAllInput!") },
    { id: true, name: true, description: true },
  ],
} as const);

const GET_PERMISSION_GROUPS_FOR_ROLE = typedGql("query")({
  getPermissionGroupsForRole: [
    { data: $("data", "IdRequestDto!") },
    { id: true, name: true, description: true },
  ],
} as const);

const UPDATE_PERMISSION_GROUPS_FOR_ROLE = typedGql("mutation")({
  updatePermissionGroupsForRole: [
    { data: $("data", "SubmitIdArrayByIdRequestDto!") },
    {
      id: true,
      permissionGroups: { id: true, name: true },
    },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface RolePermissionGroupsDndProps {
  roleId: string | null;
}

export function RolePermissionGroupsDnd({
  roleId,
}: RolePermissionGroupsDndProps) {
  /* ------------------------------- Guard UI ------------------------------ */
  if (!roleId) {
    return (
      <ContentCard height={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No role selected</Text>
        </Center>
      </ContentCard>
    );
  }

  const intRoleId = parseInt(roleId);

  /* ------------------------------ Queries ------------------------------- */
  const {
    data: allPGData,
    loading: loadingAll,
    error: errorAll,
  } = useQuery(GET_ALL_PERMISSION_GROUPS, {
    variables: { data: { all: true } },
  });

  const {
    data: rolePGData,
    loading: loadingRole,
    error: errorRole,
    refetch: refetchRolePGs,
  } = useQuery(GET_PERMISSION_GROUPS_FOR_ROLE, {
    variables: { data: { id: parseInt(roleId) } },
  });

  /* ----------------------------- Mutation ------------------------------- */
  const [updatePermissionGroupsForRole, { loading: mutating }] = useMutation(
    UPDATE_PERMISSION_GROUPS_FOR_ROLE,
    {
      refetchQueries: [
        {
          query: GET_PERMISSION_GROUPS_FOR_ROLE,
          variables: { data: { id: intRoleId } },
        },
        {
          query: GET_ALL_PERMISSION_GROUPS,
          variables: { data: { all: true } },
        },
      ],
    }
  );

  /* --------------------------- Derived state ---------------------------- */
  const allPermissionGroups = allPGData?.getAllPermissionGroup ?? [];
  const assignedRaw = rolePGData?.getPermissionGroupsForRole ?? [];

  const permissionGroupsAssignedToRole = useMemo<
    NameAndDescriptionDnDItemProps[]
  >(
    () =>
      assignedRaw.map((pg) => ({
        id: String(pg.id),
        name: pg.name,
        description: pg.description ?? "",
      })),
    [assignedRaw]
  );

  const permissionGroupsNotAssignedToRole = useMemo<
    NameAndDescriptionDnDItemProps[]
  >(
    () =>
      allPermissionGroups
        .filter((pg) => !assignedRaw.some((a) => a.id === pg.id))
        .map((pg) => ({
          id: String(pg.id),
          name: pg.name,
          description: pg.description ?? "",
        })),
    [allPermissionGroups, assignedRaw]
  );

  const columnMap: Record<
    string,
    ColumnType<NameAndDescriptionDnDItemProps>
  > = useMemo(
    () => ({
      permissionGroupsAssignedToRole: {
        title: "Assigned Permission Groups",
        columnId: "permissionGroupsAssignedToRole",
        styles: {
          container: { border: "3px dashed orange", width: "300px" },
          header: { bg: "orange.500", color: "white" },
          card: { bg: "orange.200", _hover: { bg: "orange.300" } },
        },
        items: permissionGroupsAssignedToRole,
        sortBy: (i) => i.name,
        sortDirection: "asc",
      },
      permissionGroupsNotAssignedToRole: {
        title: "Available Permission Groups",
        columnId: "permissionGroupsNotAssignedToRole",
        styles: {
          container: { border: "3px dashed purple", width: "300px" },
          header: { bg: "purple.500", color: "white" },
          card: { bg: "purple.200", _hover: { bg: "purple.300" } },
        },
        items: permissionGroupsNotAssignedToRole,
        sortBy: (i) => i.name,
        sortDirection: "asc",
      },
    }),
    [permissionGroupsAssignedToRole, permissionGroupsNotAssignedToRole]
  );

  const orderedColumnIds = [
    "permissionGroupsAssignedToRole",
    "permissionGroupsNotAssignedToRole",
  ];

  /* ---------------------------- Handlers ------------------------------- */
  const handleSubmit = useCallback(
    async (boardState: BoardState<NameAndDescriptionDnDItemProps>) => {
      const ids = boardState.columnMap.permissionGroupsAssignedToRole.items.map(
        (i) => parseInt(i.id)
      );

      await updatePermissionGroupsForRole({
        variables: {
          data: {
            recordId: intRoleId,
            idArray: ids,
          } as SubmitIdArrayByIdRequestDto,
        },
      });

      await refetchRolePGs(); // quick refresh (refetchQueries above will also run)
    },
    [intRoleId, updatePermissionGroupsForRole, refetchRolePGs]
  );

  const isLoading = loadingAll || loadingRole || mutating;

  /* ------------------------------ Render ------------------------------- */
  if (errorAll || errorRole) {
    console.log("errorAll", errorAll);
    console.log("errorRole", errorRole);

    return (
      <ContentCard height={700}>
        <Center flex={1}>
          <Text fontSize="lg" color="red.500">
            Failed to load permission groups
          </Text>
        </Center>
      </ContentCard>
    );
  }

  return (
    <ContentCard height={700}>
      <DnDBoardMain
        columnMap={columnMap}
        orderedColumnIds={orderedColumnIds}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        CardComponent={NameAndDescriptionDnDItem}
      />
    </ContentCard>
  );
}

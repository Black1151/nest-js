"use client";

import { BoardState, DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import { ContentCard } from "@/components/layout/Card";
import {
  PermissionGroup,
  SubmitIdArrayByIdRequestDto,
  useMutation,
  useQuery,
} from "@/gqty";
import { Center, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import {
  NameAndDescriptionDnDItem,
  NameAndDescriptionDnDItemProps,
} from "@/components/DnD/cards/NameAndDescriptionDndCard";

interface RolePermissionGroupsDndProps {
  roleId: string | null;
}

export const RolePermissionGroupsDnd = ({
  roleId,
}: RolePermissionGroupsDndProps) => {
  if (!roleId) {
    return (
      <ContentCard height={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No role selected</Text>
        </Center>
      </ContentCard>
    );
  }

  const query = useQuery();
  const allPermissionGroups =
    query.getAllPermissionGroup({ data: { all: true } }) ?? [];

  const permissionGroupsAssignedToRoleRaw =
    query.getPermissionGroupsForRole({ data: { id: parseInt(roleId) } }) ?? [];

  const [updatePermissionGroupsForRole, { isLoading }] = useMutation(
    (mutation, data: SubmitIdArrayByIdRequestDto) => {
      const updatedRole = mutation.updatePermissionGroupsForRole({ data });
      updatedRole.permissionGroups?.forEach((pg) => {
        pg.id;
        pg.name;
      });
    }
  );

  const permissionGroupsAssignedToRole = useMemo<
    NameAndDescriptionDnDItemProps[]
  >(
    () =>
      permissionGroupsAssignedToRoleRaw.map((pg) => ({
        id: pg.id,
        name: pg.name,
        description: pg.description ?? "",
      })),
    [permissionGroupsAssignedToRoleRaw]
  );

  const permissionGroupsNotAssignedToRole = useMemo<
    NameAndDescriptionDnDItemProps[]
  >(
    () =>
      allPermissionGroups
        .filter(
          (pg) =>
            !permissionGroupsAssignedToRole.some((pga) => pga.id === pg.id)
        )
        .map((pg) => ({
          id: pg.id,
          name: pg.name,
          description: pg.description ?? "",
        })),
    [allPermissionGroups, permissionGroupsAssignedToRole]
  );

  const columnMap: Record<
    string,
    ColumnType<NameAndDescriptionDnDItemProps>
  > = useMemo(
    () => ({
      permissionGroupsAssignedToRole: {
        title: "Assigned Permission Groups ",
        columnId: "permissionGroupsAssignedToRole",
        styles: {
          container: { border: "3px dashed orange", width: "300px" },
          header: { bg: "orange.500", color: "white" },
          card: { bg: "orange.200", _hover: { bg: "orange.300" } },
        },
        sortBy: (item) => item.name,
        sortDirection: "asc",
        items: permissionGroupsAssignedToRole,
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
        sortBy: (item) => item.name,
        sortDirection: "asc",
      },
    }),
    [permissionGroupsAssignedToRole, permissionGroupsNotAssignedToRole]
  );

  const orderedColumnIds = [
    "permissionGroupsAssignedToRole",
    "permissionGroupsNotAssignedToRole",
  ];

  const handleSubmit = useCallback(
    async (boardData: BoardState<NameAndDescriptionDnDItemProps>) => {
      const permissionGroupIds =
        boardData.columnMap.permissionGroupsAssignedToRole.items.map((item) =>
          parseInt(item.id)
        );
      await updatePermissionGroupsForRole({
        args: { recordId: parseInt(roleId), idArray: permissionGroupIds },
      });
      await query.$refetch(true);
    },
    [roleId, updatePermissionGroupsForRole, query]
  );

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
};

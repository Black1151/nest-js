import React, { useCallback, useMemo } from "react";
import { ContentCard } from "@/components/layout/Card";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { DnDBoardMain, BoardState } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import {
  NameAndDescriptionDnDItem,
  NameAndDescriptionDnDItemProps,
} from "@/components/DnD/cards/NameAndDescriptionDndCard";
import { useToast } from "@chakra-ui/react";
import { $ } from "@/zeus";
import { typedGql } from "@/zeus/typedDocumentNode";
import { useMutation, useQuery } from "@apollo/client";

export const UPDATE_USER_ROLES = typedGql("mutation")({
  updateUserRolesFromArray: [
    { data: $(`data`, "UpdateUserRolesFromArrayRequestDto!") },
    { id: true },
  ],
});

export const GET_ALL_ROLES = typedGql("query")({
  getAllRole: [
    { data: $(`data`, "FindAllInput!") },
    { id: true, name: true, description: true },
  ],
});

export const GET_ROLES_FOR_USER = typedGql("query")({
  getRolesForUser: [
    { data: $(`data`, "PublicIdRequestDto!") },
    { id: true, name: true, description: true },
  ],
});

interface UserRolesSectionProps {
  publicId: string;
}

export const UserRolesSection: React.FC<UserRolesSectionProps> = ({
  publicId,
}) => {
  const toast = useToast();

  const {
    data: allRolesData,
    loading: allRolesLoading,
    error: allRolesError,
    refetch: refetchAllRoles,
  } = useQuery(GET_ALL_ROLES, {
    variables: { data: { all: true } },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: userRolesData,
    loading: userRolesLoading,
    error: userRolesError,
    refetch: refetchUserRoles,
  } = useQuery(GET_ROLES_FOR_USER, {
    variables: { data: { publicId } },
    fetchPolicy: "cache-and-network",
  });

  const [updateUserRoles, { loading: mutationLoading }] =
    useMutation(UPDATE_USER_ROLES);

  const userRoleItems = useMemo<NameAndDescriptionDnDItemProps[]>(
    () =>
      userRolesData?.getRolesForUser?.map((r) => ({
        id: String(r.id),
        name: r.name,
        description: r.description ?? "",
      })) ?? [],
    [userRolesData]
  );

  const availableRoleItems = useMemo<NameAndDescriptionDnDItemProps[]>(() => {
    // Guard: no data yet
    if (!allRolesData?.getAllRole) return [];

    // Build a quick-lookup set of role IDs already assigned to the user
    const assignedIds = new Set(
      userRoleItems.map((item) => parseInt(item.id, 10))
    );

    // Keep only roles **not** in the assigned set
    return allRolesData.getAllRole
      .filter((role) => !assignedIds.has(Number(role.id)))
      .map((role) => ({
        id: String(role.id),
        name: role.name,
        description: role.description ?? "",
      }));
  }, [allRolesData, userRoleItems]);

  const columnMap = useMemo<
    Record<string, ColumnType<NameAndDescriptionDnDItemProps>>
  >(
    () => ({
      userRoles: {
        title: "User Roles",
        columnId: "userRoles",
        styles: {
          container: {
            border: "3px dashed",
            borderColor: "orange.300",
            w: "300px",
          },
          header: { bg: "orange.500", color: "white" },
          card: { bg: "orange.200" },
        },
        items: userRoleItems,
      },
      availableRoles: {
        title: "Available Roles",
        columnId: "availableRoles",
        styles: {
          container: {
            border: "3px dashed",
            borderColor: "purple.300",
            w: "300px",
          },
          header: { bg: "purple.700", color: "white" },
          card: { bg: "purple.200" },
        },
        items: availableRoleItems,
      },
    }),
    [userRoleItems, availableRoleItems]
  );

  const orderedColumnIds = ["userRoles", "availableRoles"];

  /* --------------------------- Submit handler ------------------------------ */
  const handleSubmit = useCallback(
    async (state: BoardState<NameAndDescriptionDnDItemProps>) => {
      const roleIds = state.columnMap.userRoles.items.map((i) =>
        parseInt(i.id, 10)
      );

      try {
        await updateUserRoles({
          variables: { data: { publicId, roleIds } },
        });

        // Refresh queries so UI reflects server state
        await Promise.all([refetchAllRoles(), refetchUserRoles()]);
        toast({
          status: "success",
          title: "Roles updated",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        toast({
          status: "error",
          title: "Failed to update roles",
          description: message,
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [publicId, updateUserRoles, refetchAllRoles, refetchUserRoles, toast]
  );

  if (allRolesLoading || userRolesLoading)
    return <LoadingSpinnerCard text="Loading roles..." />;
  if (allRolesError || userRolesError) {
    return (
      <ContentCard>
        Error: {allRolesError?.message ?? userRolesError?.message}
      </ContentCard>
    );
  }
  /* ------------------------------- Render ---------------------------------- */
  return (
    <ContentCard minHeight={700}>
      <DnDBoardMain<NameAndDescriptionDnDItemProps>
        columnMap={columnMap}
        orderedColumnIds={orderedColumnIds}
        CardComponent={NameAndDescriptionDnDItem}
        enableColumnReorder={false}
        onSubmit={handleSubmit}
        isLoading={mutationLoading}
      />
    </ContentCard>
  );
};

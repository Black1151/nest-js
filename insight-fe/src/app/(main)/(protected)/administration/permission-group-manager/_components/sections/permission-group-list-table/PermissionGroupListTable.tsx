// PermissionGroupListTable.tsx
"use client";

import React, { Suspense, useState } from "react";
import { Button, Center, Flex, Text } from "@chakra-ui/react";

import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { CreatePermissionGroupModal } from "./modals/CreatePermissionGroupModal";
import { RequirePermission } from "@/rbac/RequirePermission";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */

export const PERMISSION_GROUP_LIST = typedGql("query")({
  getAllPermissionGroup: [
    { data: $("data", "FindAllInput!") }, // { limit, offset }
    { id: true, name: true, description: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Inner table component                                                      */
/* -------------------------------------------------------------------------- */

interface PermissionGroupListTableProps {
  setSelectedPermissionGroupId: (id: string) => void;
}

function PermissionGroupListTable({
  setSelectedPermissionGroupId,
}: PermissionGroupListTableProps) {
  const [
    isCreatePermissionGroupModalOpen,
    setIsCreatePermissionGroupModalOpen,
  ] = useState(false);

  const { data, loading, error, refetch } = useQuery(PERMISSION_GROUP_LIST, {
    variables: { data: { limit: 10, offset: 0 } },
  });

  if (loading) {
    return <LoadingSpinnerCard text="Loading Permission Groups…" />;
  }

  if (error) {
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

  const permissionGroups = data?.getAllPermissionGroup ?? [];

  const formattedData = permissionGroups.map((pg) => ({
    id: pg.id,
    name: pg.name,
    description: pg.description ?? "",
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const handleRowClick = (row: { id: string }) =>
    setSelectedPermissionGroupId(row.id);

  const emptyState = formattedData.length === 0;

  return (
    <>
      <ContentCard height={700}>
        {emptyState ? (
          <Center flex={1}>
            <Text fontSize="2xl">No permission groups found</Text>
          </Center>
        ) : (
          <Flex
            justifyContent="space-between"
            flexDirection="column"
            height="100%"
            width="100%"
          >
            <DataTableSimple
              data={formattedData}
              columns={columns}
              onRowClick={handleRowClick}
            />
          </Flex>
        )}

        {/* “Create” button shown for both empty & non-empty states, gated by RBAC */}
        <RequirePermission
          permissions={["permissionGroup.createPermissionGroup"]}
        >
          <Button
            mt={4}
            colorScheme="green"
            onClick={() => setIsCreatePermissionGroupModalOpen(true)}
          >
            Create Permission Group
          </Button>
        </RequirePermission>
      </ContentCard>

      {/* Modal ------------------------------------------------------------- */}
      <CreatePermissionGroupModal
        isOpen={isCreatePermissionGroupModalOpen}
        onClose={async () => {
          setIsCreatePermissionGroupModalOpen(false);
          await refetch(); // refresh list after create
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Suspense wrapper (unchanged)                                               */
/* -------------------------------------------------------------------------- */

export default function PermissionGroupListTableWrapper(
  props: PermissionGroupListTableProps
) {
  return (
    <Suspense
      fallback={<LoadingSpinnerCard text="Loading Permission Groups…" />}
    >
      <PermissionGroupListTable {...props} />
    </Suspense>
  );
}

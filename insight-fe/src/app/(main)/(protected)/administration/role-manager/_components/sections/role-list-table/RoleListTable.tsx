// RoleManagerSection.tsx
"use client";

import React, { useState } from "react";
import { Button, Flex } from "@chakra-ui/react";

import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { CreateRoleModal } from "./sub/modals/CreateRoleModal";
import { RequirePermission } from "@/rbac/RequirePermission";
import { useAuth } from "@/context/AuthContext";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { Role } from "@/__generated__/schema-types";

/* ----------  GraphQL document  ---------- */
const GET_ALL_ROLES = typedGql("query")({
  getAllRole: [
    { data: $("data", "FindAllInput!") }, // ➜ { all: true }
    { id: true, name: true, description: true },
  ],
} as const);

/* ----------  Component  ---------- */
interface RoleManagerSectionProps {
  setSelectedRoleId: (roleId: string) => void;
}

export function RoleManagerSection({
  setSelectedRoleId,
}: RoleManagerSectionProps) {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const { userPermissions } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_ALL_ROLES, {
    variables: { data: { all: true } },
  });

  const allRoles = data?.getAllRole ?? [];

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const handleRowClick = (roleId: string) => {
    console.log("click");
    setSelectedRoleId(roleId);
  };

  return (
    <>
      <ContentCard>
        <Flex
          justifyContent="space-between"
          flexDirection="column"
          height="100%"
          width="100%"
        >
          {loading && <p className="text-sm mb-2">Loading roles…</p>}
          {error && (
            <p className="text-sm text-red-600 mb-2">
              Couldn’t load roles: {error.message}
            </p>
          )}

          {!loading && !error && (
            <DataTableSimple
              data={allRoles}
              columns={columns}
              onRowClick={(item) => handleRowClick(item.id)}
            />
          )}

          <RequirePermission permissions={["role.createRole"]}>
            <Button
              colorScheme="green"
              onClick={() => setIsCreateRoleModalOpen(true)}
              mt={4}
            >
              Create new role
            </Button>
          </RequirePermission>
        </Flex>
      </ContentCard>

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={async () => {
          setIsCreateRoleModalOpen(false);
          await refetch(); // refresh the table after a new role is created
        }}
      />
    </>
  );
}

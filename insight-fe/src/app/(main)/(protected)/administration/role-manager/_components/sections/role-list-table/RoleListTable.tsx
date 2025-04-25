// RoleManagerSection.tsx
"use client";

import { useState } from "react";
import { Button, Flex } from "@chakra-ui/react";

import { ContentCard } from "@/components/layout/Card";
import { Role, useQuery } from "@/gqty";

import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { CreateRoleModal } from "./sub/modals/CreateRoleModal";
import { RequirePermission } from "@/rbac/RequirePermission";
import { useAuth } from "@/context/AuthContext";

interface RoleManagerSectionProps {
  setSelectedRoleId: (roleId: string) => void;
}

export const RoleManagerSection = ({
  setSelectedRoleId,
}: RoleManagerSectionProps) => {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const query = useQuery();
  const { userPermissions } = useAuth();

  const allRoles = query.getAllRole({ data: { all: true } }) ?? [];

  const formattedData = allRoles.map((role: Role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const handleRowClick = (roleId: string) => {
    if (!userPermissions.includes("role.getRoleById")) {
      return;
    }

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
          <DataTableSimple
            data={formattedData}
            columns={columns}
            onRowClick={(item) => handleRowClick(item.id)}
          />
          <RequirePermission permissions={["role.createRole"]}>
            <Button
              colorScheme="green"
              onClick={() => setIsCreateRoleModalOpen(true)}
            >
              Create new role
            </Button>
          </RequirePermission>
        </Flex>
      </ContentCard>

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
      />
    </>
  );
};

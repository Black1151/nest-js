// RoleManagerSection.tsx
"use client";

import { useState } from "react";
import { Button, Flex } from "@chakra-ui/react";

import { ContentCard } from "@/components/layout/Card";
import { Role, useQuery } from "@/gqty";

import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { CreateRoleModal } from "./sub/modals/CreateRoleModal";

interface RoleManagerSectionProps {
  setSelectedRoleId: (roleId: string) => void;
}

export const RoleManagerSection = ({
  setSelectedRoleId,
}: RoleManagerSectionProps) => {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const query = useQuery();

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
            onRowClick={(item) => setSelectedRoleId(item.id)}
            // onRowClick={(item) => console.log(item.id)}
          />
          <Button
            colorScheme="green"
            onClick={() => setIsCreateRoleModalOpen(true)}
          >
            Create new role
          </Button>
        </Flex>
      </ContentCard>

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
      />
    </>
  );
};

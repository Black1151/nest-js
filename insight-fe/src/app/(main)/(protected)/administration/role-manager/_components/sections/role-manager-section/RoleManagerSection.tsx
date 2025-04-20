// RoleManagerSection.tsx
"use client";

import { useState } from "react";
import { Button } from "@chakra-ui/react";

import { ContentCard } from "@/components/layout/Card";
import { useQuery } from "@/gqty";
import { CreateRoleModal } from "./sub/modals/CreateRoleModal";

/**
 * Houses all “role management” (create / edit / delete).
 * Keeps the user‑role assignment board completely separate.
 */
export const RoleManagerSection = () => {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const query = useQuery();

  const allRoles = query.getAllRole({ data: { all: true } }) ?? [];

  return (
    <>
      <ContentCard>
        <Button
          colorScheme="green"
          onClick={() => setIsCreateRoleModalOpen(true)}
        >
          Create new role
        </Button>
        
      </ContentCard>

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
      />
    </>
  );
};

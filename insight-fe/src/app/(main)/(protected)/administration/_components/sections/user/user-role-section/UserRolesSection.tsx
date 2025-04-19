import { ContentCard } from "@/components/layout/Card";
import { useQuery } from "@/gqty";
import { Button, Center, Text } from "@chakra-ui/react";
import { useState } from "react";
import { RoleDnDItemProps } from "./components/RoleDnDItem";
import UserRolesDnD from "./UserRolesDnD";

interface UserRolesSectionProps {
  publicId: string | null;
}

export const UserRolesSection = ({ publicId }: UserRolesSectionProps) => {
  const query = useQuery();

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

  /* ---------- Read data ---------- */
  const allRoles = query.getAllRole({ data: { all: true } }) ?? [];
  const userRoles = query.getRolesForUser({ data: { publicId } }) ?? [];

  /* ---------- Transform for DnD ---------- */
  const userRoleItems: RoleDnDItemProps[] = userRoles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
  }));

  const availableRoleItems: RoleDnDItemProps[] = allRoles
    .filter((role) => !userRoles.some((ur) => ur.id === role.id))
    .map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    }));

  return (
    <>
      <ContentCard>
        <UserRolesDnD
          userRoles={userRoleItems}
          availableRoles={availableRoleItems}
        />
      </ContentCard>
    </>
  );
};

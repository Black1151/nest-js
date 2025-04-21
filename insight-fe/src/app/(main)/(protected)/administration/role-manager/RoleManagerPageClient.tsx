"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import { RoleManagerSection } from "./_components/sections/role-list-table/RoleListTable";
import { RolePermissionGroupsDnd } from "./_components/sections/role-permission-groups-dnd/RolePermissionGroupsDnd";
0;

export const RoleManagerPageClient = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <RoleManagerSection setSelectedRoleId={setSelectedRoleId} />
        <RolePermissionGroupsDnd roleId={selectedRoleId} />
      </ContentGrid>
    </>
  );
};

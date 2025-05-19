"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import { RoleManagerSection } from "./_components/sections/role-list-table/RoleListTable";
import { RolePermissionGroupsDnd } from "./_components/sections/role-permission-groups-dnd/RolePermissionGroupsDnd";
import { RequirePermission } from "@/rbac/RequirePermission";

export const RoleManagerPageClient = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // TODO: Uncomment this when we have a way to handle permissions//
  // usePermissionRedirect({
  //   permissions: ["role.getAllRole"],
  // });

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <RoleManagerSection setSelectedRoleId={setSelectedRoleId} />
        <RequirePermission permissions={["role.updatePermissionGroupsForRole"]}>
          <RolePermissionGroupsDnd roleId={selectedRoleId} />
        </RequirePermission>
      </ContentGrid>
    </>
  );
};

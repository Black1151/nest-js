"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import { RoleManagerSection } from "./_components/sections/role-list-table/RoleListTable";
import { RolePermissionGroupsDnd } from "./_components/sections/role-permission-groups-dnd/RolePermissionGroupsDnd";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { RequirePermission } from "@/rbac/RequirePermission";
0;

export const RoleManagerPageClient = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const { userPermissions } = useAuth();

  if (!userPermissions.includes("role.getAllRole")) {
    redirect("/unauthorised");
  }

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

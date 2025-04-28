"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import PermissionGroupListTable from "./sections/permission-group-list-table/PermissionGroupListTable";
import { PermissionGroupPermissionDnd } from "./sections/permission-group-permission-dnd/PermissionGroupPermissionDnd";
import { usePermissionRedirect } from "@/hooks/PermissionRedirect";

export const PermissionGroupManagerPageClient = () => {
  const [selectedPermissionGroupId, setSelectedPermissionGroupId] = useState<
    number | null
  >(null);

  usePermissionRedirect({
    permissions: ["permissionGroup.getAllPermissionGroup"],
  });

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <PermissionGroupListTable
          setSelectedPermissionGroupId={(id) =>
            setSelectedPermissionGroupId(Number(id))
          }
        />
        <PermissionGroupPermissionDnd groupId={selectedPermissionGroupId} />
      </ContentGrid>
    </>
  );
};

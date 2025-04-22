"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import PermissionGroupListTable from "./sections/permission-group-list-table/PermissionGroupListTable";

export const PermissionGroupManagerPageClient = () => {
  const [selectedPermissionGroupId, setSelectedPermissionGroupId] = useState<
    string | null
  >(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <PermissionGroupListTable
          setSelectedPermissionGroupId={setSelectedPermissionGroupId}
        />
      </ContentGrid>
    </>
  );
};

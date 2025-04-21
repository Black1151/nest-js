"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";

export const PermissionGroupManagerPageClient = () => {
  const [selectedPermissionGroupId, setSelectedPermissionGroupId] = useState<
    string | null
  >(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr"> asds</ContentGrid>
    </>
  );
};

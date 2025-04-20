"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import { RoleManagerSection } from "./_components/sections/role-manager-section/RoleManagerSection";
0;

export const RoleManagerPageClient = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <RoleManagerSection />
      </ContentGrid>
    </>
  );
};

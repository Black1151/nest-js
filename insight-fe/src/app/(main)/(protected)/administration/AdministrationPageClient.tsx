"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import UserListTable from "./_components/sections/user/UserListTable";
import { UserDetailSection } from "./_components/sections/user/user-details-section/UserDetailSection";
import { UserRolesSection } from "./_components/sections/user/user-role-section/UserRolesSection";

export const AdministrationPageClient = () => {
  const [selectedUserPublicId, setSelectedUserPublicId] = useState<
    string | null
  >(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <UserListTable setSelectedUserPublicId={setSelectedUserPublicId} />
        <UserDetailSection publicId={selectedUserPublicId} />
        <UserRolesSection publicId={selectedUserPublicId} />
      </ContentGrid>
    </>
  );
};

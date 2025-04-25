"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import UserListTable from "./_components/sections/user/UserListTable";
import { UserDetailSection } from "./_components/sections/user/user-details-section/UserDetailSection";
import { UserRolesSection } from "./_components/sections/user/user-role-section/UserRolesSection";
import { useAuth } from "@/context/AuthContext";
import { RequirePermission } from "@/rbac/RequirePermission";

export function UserManagerPageClient() {
  const [selectedUserPublicId, setSelectedUserPublicId] = useState<
    string | null
  >(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <UserListTable setSelectedUserPublicId={setSelectedUserPublicId} />

        <RequirePermission permission="user.get">
          <UserDetailSection
            publicId={selectedUserPublicId}
            setSelectedUserPublicId={setSelectedUserPublicId}
          />
        </RequirePermission>

        <RequirePermission permission="user.getRolesForUser">
          <UserRolesSection publicId={selectedUserPublicId} />
        </RequirePermission>
      </ContentGrid>
    </>
  );
}

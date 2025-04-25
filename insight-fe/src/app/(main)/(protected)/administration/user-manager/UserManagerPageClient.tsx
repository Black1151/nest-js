"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import UserListTable from "./_components/sections/user/UserListTable";
import { UserDetailSection } from "./_components/sections/user/user-details-section/UserDetailSection";
import { UserRolesSection } from "./_components/sections/user/user-role-section/UserRolesSection";
import { useAuth } from "@/context/AuthContext";
import { RequirePermission } from "@/rbac/RequirePermission";
import { redirect } from "next/navigation";

export function UserManagerPageClient() {
  const [selectedUserPublicId, setSelectedUserPublicId] = useState<
    string | null
  >(null);

  const { userPermissions } = useAuth();

  if (!userPermissions.includes("user.getAllUsers")) {
    redirect("/unauthorised");
  }

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <UserListTable setSelectedUserPublicId={setSelectedUserPublicId} />

        <RequirePermission permissions={["user.getUserByPublicId"]}>
          <UserDetailSection
            publicId={selectedUserPublicId}
            setSelectedUserPublicId={setSelectedUserPublicId}
          />
        </RequirePermission>

        <RequirePermission
          permissions={[
            "user.getRolesForUser",
            "user.updateUserRolesFromArray",
            "role.findAllRole",
          ]}
        >
          <UserRolesSection publicId={selectedUserPublicId} />
        </RequirePermission>
      </ContentGrid>
    </>
  );
}

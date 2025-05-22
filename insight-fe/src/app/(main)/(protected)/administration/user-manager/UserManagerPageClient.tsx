"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import UserListTable from "./_components/sections/user/UserListTable";
import { UserDetailSection } from "./_components/sections/user/user-details-section/UserDetailSection";
import { UserRolesSection } from "./_components/sections/user/user-role-section/UserRolesSection";
import { RequirePermission } from "@/rbac/RequirePermission";
import { usePermissionRedirect } from "@/hooks/PermissionRedirect";
import { ContentCard } from "@/components/layout/Card";
import { Center } from "@chakra-ui/react";
import { NoUserSelectedCard } from "./_components/cards/NoUserSelectedCard";
import { UserSearchInput } from "./_components/sections/user/UserSearchInput";

export function UserManagerPageClient() {
  const [selectedUserPublicId, setSelectedUserPublicId] = useState<
    string | null
  >(null);

  /////////// THIS IS BUGGED AND TRIGGERING A REDIRECT BEFORE PERMS HAVE LOADED
  // usePermissionRedirect({
  //   permissions: ["user.getAllUsers"],
  // });

  return (
    <>
      <UserSearchInput onSelect={setSelectedUserPublicId} />
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
            "role.getAllRole",
          ]}
        >
          {selectedUserPublicId ? (
            <UserRolesSection publicId={selectedUserPublicId} />
          ) : (
            <NoUserSelectedCard />
          )}
        </RequirePermission>
      </ContentGrid>
    </>
  );
}

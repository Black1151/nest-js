"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import UserListTable from "./_components/sections/user/UserListTable";
import { UserDetailSection } from "./_components/sections/user/UserDetailSection";
import { CreateUserModal } from "./_components/modals/CreateUserModal";
import { CreateUserSection } from "./_components/sections/user/CreateUserSection";

export const AdministrationPageClient = () => {
  const [selectedUserPublicId, setSelectedUserPublicId] = useState<
    string | null
  >(null);

  return (
    <>
      <ContentGrid gridTemplateColumns="1fr 1fr">
        <UserListTable setSelectedUserPublicId={setSelectedUserPublicId} />
        <UserDetailSection publicId={selectedUserPublicId} />
        <CreateUserSection />
      </ContentGrid>
    </>
  );
};

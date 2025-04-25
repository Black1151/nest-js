"use client";

import React, { Suspense, useState } from "react";
import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { useQuery, User } from "@/gqty";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { Button, Flex } from "@chakra-ui/react";
import { CreateUserModal } from "../../modals/CreateUserModal";
import { RequirePermission } from "@/rbac/RequirePermission";

interface UserListTableProps {
  setSelectedUserPublicId: (publicId: string) => void;
}

function UserListTable({ setSelectedUserPublicId }: UserListTableProps) {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const query = useQuery();
  const { isLoading } = query.$state;
  const users = query.getAllUsers({ data: { limit: 10, offset: 0 } });

  const formattedData = users.map((u: User) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    publicId: u.publicId,
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
  ];

  const handleRowClick = (rowData: any) => {
    setSelectedUserPublicId(rowData.publicId);
  };

  if (isLoading) {
    return <LoadingSpinnerCard text="Loading Users..." />;
  }

  return (
    <>
      <ContentCard>
        {formattedData[0].id && (
          <Flex
            justifyContent="space-between"
            flexDirection="column"
            height="100%"
            width="100%"
          >
            <DataTableSimple
              data={formattedData}
              columns={columns}
              onRowClick={handleRowClick}
            />
            <Button
              colorScheme="green"
              onClick={() => setIsCreateUserModalOpen(true)}
            >
              Create User
            </Button>
          </Flex>
        )}
      </ContentCard>
      <RequirePermission permissions={["user.create"]}>
        <CreateUserModal
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
        />
      </RequirePermission>
    </>
  );
}

export default function UserListTableWrapper(props: UserListTableProps) {
  return (
    <Suspense fallback={<LoadingSpinnerCard text="Loading Users..." />}>
      <UserListTable {...props} />
    </Suspense>
  );
}

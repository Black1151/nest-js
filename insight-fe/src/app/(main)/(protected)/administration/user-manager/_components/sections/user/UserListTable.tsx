"use client";

import React, { Suspense, useState } from "react";
import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { useQuery, User } from "@/gqty";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { Button, Flex, HStack } from "@chakra-ui/react";
import { CreateUserModal } from "../../modals/CreateUserModal";
import { RequirePermission } from "@/rbac/RequirePermission";

interface UserListTableProps {
  setSelectedUserPublicId: (publicId: string) => void;
}

function UserListTable({ setSelectedUserPublicId }: UserListTableProps) {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [userType, setUserType] = useState<"student" | "educator">("student");
  const query = useQuery();
  const { isLoading } = query.$state;
  const users = query.getAllUsers({ data: { limit: 10, offset: 0 } });

  const formattedData = users.map((u: User) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    publicId: u.publicId,
    userType: u.userType,
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "userType", label: "User Type" },
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
            <RequirePermission permissions={["user.createUser"]}>
              <HStack>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    setUserType("student");
                    setIsCreateUserModalOpen(true);
                  }}
                >
                  Add Student
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setUserType("educator");
                    setIsCreateUserModalOpen(true);
                  }}
                >
                  Add Staff
                </Button>
              </HStack>
            </RequirePermission>
          </Flex>
        )}
      </ContentCard>
      <RequirePermission permissions={["user.createUser"]}>
        <CreateUserModal
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
          userType={userType}
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

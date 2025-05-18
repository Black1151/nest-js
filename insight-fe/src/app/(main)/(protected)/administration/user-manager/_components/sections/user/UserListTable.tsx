"use client";

import React, { useState } from "react";
import { Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";

import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { Button, Flex, HStack } from "@chakra-ui/react";
import { CreateUserModal } from "../../modals/CreateUserModal";
import { RequirePermission } from "@/rbac/RequirePermission";
import { typedGql } from "@/zeus/typedDocumentNode";

export const USER_LIST_TABLE_LOAD_USERS = typedGql("query")({
  getAllUsers: [
    { data: { limit: 10, offset: 0 } },
    {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      publicId: true,
      userType: true,
    },
  ],
} as const);

interface UserListTableProps {
  setSelectedUserPublicId: (publicId: string) => void;
}

function UserListTable({ setSelectedUserPublicId }: UserListTableProps) {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [userType, setUserType] = useState<"student" | "educator">("student");
  const { data, loading, error } = useQuery(USER_LIST_TABLE_LOAD_USERS);

  if (loading) {
    return <LoadingSpinnerCard text="Loading Users..." />;
  }

  if (error || !data) {
    return <ContentCard>Error loading users: {error?.message}</ContentCard>;
  }

  const formattedData = data.getAllUsers.map((u) => ({
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

  return (
    <>
      <ContentCard>
        <Flex direction="column" justify="space-between" h="100%" w="100%">
          <DataTableSimple
            data={formattedData}
            columns={columns}
            onRowClick={handleRowClick}
          />
          <RequirePermission permissions={["user.createUser"]}>
            <HStack mt={4}>
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
  return <UserListTable {...props} />;
}

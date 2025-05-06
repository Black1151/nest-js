import { Button, Center, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UserDetailsDisplay } from "./UserDetailsDisplay";
import { UpdateUserModal } from "../../../modals/UpdateUserModal";
import { ContentCard } from "@/components/layout/Card";
import { DeleteUserModal } from "../../../modals/DeleteUserModal";
import { useQuery } from "@/gqty";

import type { User } from "@/gqty";
import { RequirePermission } from "@/rbac/RequirePermission";

interface UserDetailSectionProps {
  publicId: string | null;
  setSelectedUserPublicId: (publicId: null) => void;
}

export const UserDetailSection = ({
  publicId,
  setSelectedUserPublicId,
}: UserDetailSectionProps) => {
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  if (!publicId)
    return (
      <ContentCard height={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No user selected</Text>
        </Center>
      </ContentCard>
    );

  return (
    <>
      <ContentCard>
        <RequirePermission
          permissions={["user.getUserByPublicId"]}
          fallback={
            <Text>You do not have permission to view user details</Text>
          }
        >
          <UserDetailsDisplay publicId={publicId} />
        </RequirePermission>
        <HStack spacing={4} pt={4}>
          <RequirePermission
            permissions={[
              "user.getUserByPublicId",
              "user.updateUserByPublicId",
            ]}
          >
            <Button
              colorScheme="blue"
              onClick={() => setIsUpdateUserModalOpen(true)}
            >
              Update User
            </Button>
          </RequirePermission>
          <RequirePermission
            permissions={[
              "user.getUserByPublicId",
              "user.removeUserByPublicId",
            ]}
          >
            <Button
              colorScheme="red"
              onClick={() => setIsDeleteUserModalOpen(true)}
            >
              Delete User
            </Button>
          </RequirePermission>
        </HStack>
      </ContentCard>
      <UpdateUserModal
        isOpen={isUpdateUserModalOpen}
        onClose={() => setIsUpdateUserModalOpen(false)}
        publicId={publicId}
      />
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => {
          setIsDeleteUserModalOpen(false);
        }}
        setSelectedUserPublicId={setSelectedUserPublicId}
        publicId={publicId}
      />
    </>
  );
};

import { Button, Center, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UserDetailsDisplay } from "./UserDetailsDisplay";
import { UpdateUserModal } from "../../../modals/UpdateUserModal";
import { ContentCard } from "@/components/layout/Card";
import { DeleteUserModal } from "../../../modals/DeleteUserModal";
import { useQuery } from "@/gqty";

import type { User } from "@/gqty";

export const prepareUser = (user: User) => {
  user.firstName;
  user.lastName;
  user.email;
  user.phoneNumber;
  user.dateOfBirth;
  user.addressLine1;
  user.addressLine2;
  user.city;
  user.county;
  user.country;
  user.postalCode;
  user.id;
  user.publicId;
  user.createdAt;
  user.updatedAt;
};

interface UserDetailSectionProps {
  publicId: string | null;
}

export const UserDetailSection = ({ publicId }: UserDetailSectionProps) => {
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const query = useQuery({
    suspense: Boolean(publicId),
    prepare({ query: { getUserByPublicId } }) {
      if (!publicId) return;
      const user = getUserByPublicId({ publicId });
      prepareUser(user);
    },
  });

  const user = publicId ? query.getUserByPublicId({ publicId }) : null;

  return (
    <>
      <ContentCard height={700}>
        {publicId ? (
          <>
            <UserDetailsDisplay user={user} />
            <HStack spacing={4} pt={4}>
              <Button
                colorScheme="blue"
                // isLoading={!publicId}
                onClick={() => setIsUpdateUserModalOpen(true)}
              >
                Update User
              </Button>
              <Button
                colorScheme="red"
                // isLoading={!publicId}
                onClick={() => setIsDeleteUserModalOpen(true)}
              >
                Delete User
              </Button>
            </HStack>
          </>
        ) : (
          <Center flex={1}>
            <Text fontSize="2xl">No user selected</Text>
          </Center>
        )}
      </ContentCard>
      <UpdateUserModal
        isOpen={isUpdateUserModalOpen}
        onClose={() => setIsUpdateUserModalOpen(false)}
        publicId={publicId ?? ""}
      />
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
        publicId={publicId ?? ""}
      />
    </>
  );
};

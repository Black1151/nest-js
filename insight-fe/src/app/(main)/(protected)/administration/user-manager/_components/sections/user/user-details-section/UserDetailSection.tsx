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
  setSelectedUserPublicId: (publicId: null) => void;
}

export const UserDetailSection = ({ publicId, setSelectedUserPublicId }: UserDetailSectionProps) => {
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
        <UserDetailsDisplay publicId={publicId} />
        <HStack spacing={4} pt={4}>
          <Button
            colorScheme="blue"
            onClick={() => setIsUpdateUserModalOpen(true)}
          >
            Update User
          </Button>
          <Button
            colorScheme="red"
            onClick={() => setIsDeleteUserModalOpen(true)}
          >
            Delete User
          </Button>
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

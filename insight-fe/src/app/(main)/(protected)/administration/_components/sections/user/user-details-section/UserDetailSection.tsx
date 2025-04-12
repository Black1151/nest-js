import { Button, HStack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { UserDetailsDisplay } from "./UserDetailsDisplay";
import { UpdateUserModal } from "../../../modals/UpdateUserModal";
import { ContentCard } from "@/components/layout/Card";
interface UserDetailSectionProps {
  publicId: string | null;
}

export const UserDetailSection = ({ publicId }: UserDetailSectionProps) => {
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);

  const emptyStateCard = useMemo(() => {
    return (
      <ContentCard>
        <Text>No user selected.</Text>
      </ContentCard>
    );
  }, []);

  if (!publicId) {
    return emptyStateCard;
  }

  return (
    <>
      <ContentCard>
        <UserDetailsDisplay publicId={publicId} />
        <HStack spacing={4}>
          <Button onClick={() => setIsUpdateUserModalOpen(true)}>
            Update User
          </Button>
        </HStack>
      </ContentCard>
      <UpdateUserModal
        isOpen={isUpdateUserModalOpen}
        onClose={() => setIsUpdateUserModalOpen(false)}
        publicId={publicId}
      />
    </>
  );
};

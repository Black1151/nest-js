import { ContentCard } from "@/components/layout/Card";
import { Button, useDisclosure } from "@chakra-ui/react";
import { CreateUserModal } from "../../modals/CreateUserModal";

export const CreateUserSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ContentCard>
      <Button colorScheme="green" onClick={onOpen}>
        Create User
      </Button>
      <CreateUserModal isOpen={isOpen} onClose={onClose} />
    </ContentCard>
  );
};

import { Button, HStack } from "@chakra-ui/react";
import { BaseModal } from "./BaseModal";

export interface ConfirmationModalProps {
  action: string;
  bodyText: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  action,
  bodyText,
  isOpen,
  onConfirm,
  onClose,
  isLoading,
}: ConfirmationModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm ${action}`}
      footer={
        <HStack>
          <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading}>
            Confirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      {bodyText}
    </BaseModal>
  );
};

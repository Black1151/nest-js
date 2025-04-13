import {
  Button,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Modal } from "@chakra-ui/react";

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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm {action}</ModalHeader>
        <ModalBody>{bodyText}</ModalBody>
        <ModalFooter>
          <HStack>
            <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading}>
              Confirm
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

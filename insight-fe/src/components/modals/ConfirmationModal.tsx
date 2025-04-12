import {
  Button,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { Modal } from "@chakra-ui/react";

export interface ConfirmationModalProps {
  action: string;
  bodyText: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  action,
  bodyText,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalHeader>Confirm {action}</ModalHeader>
      <ModalBody>{bodyText}</ModalBody>
      <ModalFooter>
        <HStack>
          <Button colorScheme="red" onClick={onConfirm}>
            Confirm
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </HStack>
      </ModalFooter>
    </Modal>
  );
};

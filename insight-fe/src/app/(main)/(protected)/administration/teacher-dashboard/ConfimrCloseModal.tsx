// ConfirmCloseModal.tsx

import React from "react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { VStack, Text, HStack, Button } from "@chakra-ui/react";

interface ConfirmCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmCloseModal: React.FC<ConfirmCloseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <PerygonModal
      title="Confirm Close"
      body={
        <VStack spacing={4}>
          <Text>Are you sure you want to close without saving?</Text>
          <HStack spacing={4}>
            <Button onClick={onConfirm}>Yes</Button>
            <Button onClick={onClose}>No</Button>
          </HStack>
        </VStack>
      }
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default ConfirmCloseModal;

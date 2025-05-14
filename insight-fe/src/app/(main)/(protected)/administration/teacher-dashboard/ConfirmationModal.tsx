import React, { useState } from "react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { VStack, Text, HStack, Button, Input } from "@chakra-ui/react";

interface ConfirmCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  enhancedConfirm: boolean;
}

const ConfirmCloseModal: React.FC<ConfirmCloseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  enhancedConfirm,
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  return (
    <PerygonModal
      title={title}
      body={
        <VStack spacing={4}>
          <Text>{message}</Text>
          {enhancedConfirm && (
            <Input
              placeholder="Type 'I am 100% certain' to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />
          )}
          <HStack spacing={4}>
            <Button
              onClick={onConfirm}
              disabled={
                enhancedConfirm && confirmationText !== "I am 100% certain"
              }
            >
              Yes
            </Button>
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

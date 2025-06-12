import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalProps as ChakraModalProps,
} from "@chakra-ui/react";

interface BaseModalProps
  extends Pick<ChakraModalProps, "isOpen" | "onClose" | "size"> {
  title?: string;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Element to focus when the modal opens */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Element to return focus to when the modal closes */
  finalFocusRef?: React.RefObject<HTMLElement>;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  title,
  showCloseButton = true,
  footer,
  children,
  initialFocusRef,
  finalFocusRef,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      isCentered
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
    >
      <ModalOverlay />
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        {showCloseButton && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

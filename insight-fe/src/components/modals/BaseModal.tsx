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
  ModalContentProps,
} from "@chakra-ui/react";

interface BaseModalProps
  extends Pick<ChakraModalProps, "isOpen" | "onClose" | "size"> {
  title?: string;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  /** Additional props forwarded to ModalContent */
  contentProps?: ModalContentProps;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  title,
  showCloseButton = true,
  footer,
  contentProps,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay />
      <ModalContent {...contentProps}>
        {title && <ModalHeader>{title}</ModalHeader>}
        {showCloseButton && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

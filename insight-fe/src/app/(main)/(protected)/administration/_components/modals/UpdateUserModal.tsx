import { BaseModal } from "@/components/modals/BaseModal";
import { UpdateUserForm } from "../forms/UpdateUserForm";

interface UpdateUserModalProps {
  publicId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateUserModal = ({
  publicId,
  isOpen,
  onClose,
}: UpdateUserModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Update User"
      showCloseButton
    >
      <UpdateUserForm publicId={publicId} />
    </BaseModal>
  );
};

import { BaseModal } from "@/components/modals/BaseModal";
import { UpdateUserForm } from "../forms/UpdateUserForm";

interface UpdateUserModalProps {
  publicId: string | null;
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
      title="Update user"
      showCloseButton
    >
      <UpdateUserForm publicId={publicId} onClose={onClose} />
    </BaseModal>
  );
};

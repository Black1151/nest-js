import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useMutation } from "@/gqty";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicId: string;
}

export const DeleteUserModal = ({
  isOpen,
  onClose,
  publicId,
}: DeleteUserModalProps) => {
  const [removeUserByPublicId, { isLoading }] = useMutation(
    (mutation, publicId: string) => {
      const mutationReturn = mutation.removeUserByPublicId({
        publicId,
      });
      mutationReturn.id;
    }
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      isLoading={isLoading}
      onClose={onClose}
      action="delete user"
      bodyText="Are you sure you want to delete this user?"
      onConfirm={async () => {
        await removeUserByPublicId({
          args: publicId,
        });
        onClose();
      }}
    />
  );
};

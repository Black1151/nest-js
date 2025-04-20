import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { PublicIdRequestDto, useMutation, useQuery } from "@/gqty";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicId: string;
  setSelectedUserPublicId: (publicId: null) => void;
}

export const DeleteUserModal = ({
  isOpen,
  onClose,
  publicId,
  setSelectedUserPublicId,
}: DeleteUserModalProps) => {
  const query = useQuery();

  const [removeUserByPublicId, meta] = useMutation(
    (mutation, { publicId }: PublicIdRequestDto) => {
      const result = mutation.removeUserByPublicId({ data: { publicId } });
      result.publicId;
      return result;
    },
    {
      onError() {
        query.$refetch?.(true);
      },
    }
  );

  const deleteUser = async (publicId: string) => {
    setSelectedUserPublicId(null);
    const users = query.getAllUsers({ data: { limit: 10, offset: 0 } });
    // optimistic update
    const idx = users.findIndex((u) => u?.publicId === publicId);
    if (idx !== -1) users.splice(idx, 1);
    await removeUserByPublicId({ args: { publicId } });
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      action="delete user"
      bodyText="Are you sure you want to delete this user?"
      onConfirm={async () => {
        await deleteUser(publicId);
        onClose();
      }}
    />
  );
};

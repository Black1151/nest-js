"use client";

import React from "react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { USER_LIST_TABLE_LOAD_USERS } from "../sections/user/UserListTable";

/* ----------  GraphQL document  ---------- */
const REMOVE_USER_BY_PUBLIC_ID = typedGql("mutation")({
  removeUserByPublicId: [
    { data: $("data", "PublicIdRequestDto!") },
    { publicId: true }, // return field(s) you need
  ],
} as const);

/* ----------  Component  ---------- */
interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicId: string;
  setSelectedUserPublicId: (publicId: null) => void;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  publicId,
  setSelectedUserPublicId,
}: DeleteUserModalProps) {
  const [removeUserByPublicId, { loading, error }] = useMutation(
    REMOVE_USER_BY_PUBLIC_ID,
    {
      variables: { data: { publicId } },
      // keep the user list current
      refetchQueries: [
        {
          query: USER_LIST_TABLE_LOAD_USERS,
          variables: { data: { limit: 10, offset: 0 } },
        },
      ],
      awaitRefetchQueries: true,
      // tidy up when finished
      onCompleted: () => {
        setSelectedUserPublicId(null);
        onClose();
      },
      // quick UX win – optimistic removal from the cache
      optimisticResponse: {
        removeUserByPublicId: { publicId },
      },
    }
  );

  const handleConfirm = async () => {
    try {
      await removeUserByPublicId();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      action="delete user"
      bodyText="Are you sure you want to delete this user?"
      onConfirm={handleConfirm}
      isLoading={loading}
    />
  );
}

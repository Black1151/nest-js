"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { CreateUserForm } from "../forms/CreateUserForm";
import { useMutation } from "@apollo/client";
import { CreateUserWithProfileInput } from "@/__generated__/schema-types";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { USER_LIST_TABLE_LOAD_USERS } from "../sections/user/UserListTable";

const CREATE_USER_WITH_PROFILE = typedGql("mutation")({
  createUserWithProfile: [
    { data: $("data", "CreateUserWithProfileInput!") },
    { id: true },
  ],
} as const);

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "student" | "educator";
}

export function CreateUserModal({
  isOpen,
  onClose,
  userType,
}: CreateUserModalProps) {
  const [createUserWithProfile, { loading, error }] = useMutation(
    CREATE_USER_WITH_PROFILE,
    {
      refetchQueries: [
        {
          query: USER_LIST_TABLE_LOAD_USERS,
          variables: { data: { limit: 10, offset: 0 } },
        },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => onClose(),
    }
  );

  const handleSubmit = async (data: CreateUserWithProfileInput) => {
    try {
      await createUserWithProfile({ variables: { data } });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create New User"
      showCloseButton
    >
      <CreateUserForm onSubmit={handleSubmit} userType={userType} />

      {loading && <p className="text-sm mt-2">Creating user…</p>}
      {error && (
        <p className="text-sm text-red-600 mt-2">
          Something went wrong: {error.message}
        </p>
      )}
    </BaseModal>
  );
}

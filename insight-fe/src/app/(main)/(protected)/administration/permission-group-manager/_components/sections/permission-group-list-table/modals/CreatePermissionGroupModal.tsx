"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { CreatePermissionGroupForm } from "../forms/CreatePermissionGroupForm";

import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { CreatePermissionGroupInput } from "@/__generated__/schema-types";
import { PERMISSION_GROUP_LIST } from "../PermissionGroupListTable"; // reuse query to refresh

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const CREATE_PERMISSION_GROUP = typedGql("mutation")({
  createPermissionGroup: [
    { data: $("data", "CreatePermissionGroupInput!") },
    { id: true, name: true, description: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface CreatePermissionGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePermissionGroupModal({
  isOpen,
  onClose,
}: CreatePermissionGroupModalProps) {
  const [createPermissionGroup, { loading, error }] = useMutation(
    CREATE_PERMISSION_GROUP,
    {
      refetchQueries: [
        {
          query: PERMISSION_GROUP_LIST,
          variables: { data: { limit: 10, offset: 0 } },
        },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => onClose(),
    }
  );

  const handleSubmit = async (data: CreatePermissionGroupInput) => {
    try {
      await createPermissionGroup({ variables: { data } });
    } catch {
      /* error surfaced below */
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create New Permission Group"
      showCloseButton
    >
      <CreatePermissionGroupForm onSubmit={handleSubmit} />

      {loading && <p className="text-sm mt-2">Creating permission group…</p>}
      {error && (
        <p className="text-sm text-red-600 mt-2">
          Something went wrong: {error.message}
        </p>
      )}
    </BaseModal>
  );
}

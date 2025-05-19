"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { CreateRoleForm } from "../forms/CreateRoleForm";
import { useToast } from "@chakra-ui/react"; // Import useToast

import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { CreateRoleInput } from "@/__generated__/schema-types";
import { GET_ALL_ROLES } from "@/app/(main)/(protected)/administration/user-manager/_components/sections/user/user-role-section/UserRolesSection";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                            */
/* -------------------------------------------------------------------------- */
const CREATE_ROLE = typedGql("mutation")({
  createRole: [
    { data: $("data", "CreateRoleInput!") },
    { id: true, name: true, description: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */
interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoleModal({ isOpen, onClose }: CreateRoleModalProps) {
  const toast = useToast();
  const [createRole, { loading, error }] = useMutation(CREATE_ROLE, {
    refetchQueries: [
      {
        query: GET_ALL_ROLES,
        variables: { data: { all: true } },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => onClose(),
  });

  const handleSubmit = async (data: CreateRoleInput) => {
    try {
      await createRole({ variables: { data } });
    } catch (e) {
      toast({
        title: "Error creating role",
        description: "There was an error creating the role. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create New Role"
      showCloseButton
    >
      <CreateRoleForm onSubmit={handleSubmit} isLoading={loading} />
    </BaseModal>
  );
}

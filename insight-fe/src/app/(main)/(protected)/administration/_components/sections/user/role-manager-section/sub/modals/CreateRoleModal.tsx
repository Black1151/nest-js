"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { Role, useMutation } from "@/gqty";
import { CreateRoleForm } from "../forms/CreateRoleForm";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoleModal({ isOpen, onClose }: CreateUserModalProps) {
  const [createUser] = useMutation((mutation, data: Role) => {
    const mutationReturn = mutation.createRole({ data });
    mutationReturn.id;
  });

  const handleSubmit = async (data: Role) => {
    await createUser({ args: data });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create New Role"
      showCloseButton={true}
    >
      <CreateRoleForm onSubmit={(data: Role) => handleSubmit(data)} />
    </BaseModal>
  );
}

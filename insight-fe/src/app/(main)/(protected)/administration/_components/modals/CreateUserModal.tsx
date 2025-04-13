"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { CreateUserDto, useMutation } from "@/gqty";
import { CreateUserForm } from "../forms/CreateUserForm";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [createUser] = useMutation((mutation, data: CreateUserDto) => {
    const mutationReturn = mutation.createUser({ data });
    mutationReturn.id;
  });

  const handleSubmit = async (data: CreateUserDto) => {
    await createUser({ args: data });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create New User"
      showCloseButton={true}
    >
      <CreateUserForm onSubmit={(data: CreateUserDto) => handleSubmit(data)} />
    </BaseModal>
  );
}

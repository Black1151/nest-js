"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { CreateUserWithProfileInput, useMutation } from "@/gqty";
import { CreateUserForm } from "../forms/CreateUserForm";

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
  const [createUserWithProfile] = useMutation(
    (mutation, data: CreateUserWithProfileInput) => {
      const mutationReturn = mutation.createUserWithProfile({ data });
      mutationReturn.id;
    }
  );

  const handleSubmit = async (data: CreateUserWithProfileInput) => {
    await createUserWithProfile({ args: data });
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
      <CreateUserForm
        onSubmit={(data: CreateUserWithProfileInput) => handleSubmit(data)}
        userType={userType}
      />
    </BaseModal>
  );
}

"use client";

import React from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { CreatePermissionGroupInput, useMutation } from "@/gqty";
import { CreatePermissionGroupForm } from "../forms/CreatePermissionGroupForm";
interface CreatePermissionGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePermissionGroupModal({
  isOpen,
  onClose,
}: CreatePermissionGroupModalProps) {
  const [createPermissionGroup] = useMutation(
    (mutation, data: CreatePermissionGroupInput) => {
      const mutationReturn = mutation.createPermissionGroup({ data });
      mutationReturn.id;
    },
    {
      onComplete: () => {
        onClose();
      },
    }
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create New Permission Group"
      showCloseButton={true}
    >
      <CreatePermissionGroupForm
        onSubmit={(data: CreatePermissionGroupInput) =>
          createPermissionGroup({ args: data })
        }
      />
    </BaseModal>
  );
}

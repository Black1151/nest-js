"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import CrudDropdown from "../CrudDropdown";
import { useQuery, useMutation, gql } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { BaseModal } from "@/components/modals/BaseModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CreateKeyStageForm from "./forms/CreateKeyStageForm";
import UpdateKeyStageForm from "./forms/UpdateKeyStageForm";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_ALL_KEY_STAGES = typedGql("query")({
  getAllKeyStage: [
    { data: $("data", "FindAllInput!") }, // { all: true }
    { id: true, name: true, description: true },
  ],
} as const);

const DELETE_KEY_STAGE = gql`
  mutation DeleteKeyStage($data: IdInput!) {
    deleteKeyStage(data: $data)
  }
`;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface KeyStageDropdownProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

export function KeyStageDropdown({ value, onChange }: KeyStageDropdownProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* ---------- list (fetched once, cached by Apollo) ---------- */
  const { data, loading, refetch } = useQuery(GET_ALL_KEY_STAGES, {
    variables: { data: { all: true } },
  });

  const keyStages = data?.getAllKeyStage ?? [];

  /* ---------- options ---------- */
  const options = useMemo(
    () =>
      keyStages.map((ks) => ({
        label: ks.name ?? "",
        value: String(ks.id), // GraphQL ID → string
      })),
    [keyStages]
  );

  const selected = keyStages.find((ks) => String(ks.id) === value);

  const [deleteKeyStage, { loading: deleting }] = useMutation(DELETE_KEY_STAGE, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      onChange(null);
      refetch();
    },
  });

  /* ---------- render ---------- */
  return (
    <>
      <CrudDropdown
        options={options}
        value={value ?? ""}
        isLoading={loading}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value || null)
        }
        onCreate={() => setIsCreateOpen(true)}
        onUpdate={() => setIsUpdateOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={!value}
        isDeleteDisabled={!value}
      />

      <BaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Key Stage"
      >
        <CreateKeyStageForm
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <BaseModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Key Stage"
      >
        <UpdateKeyStageForm
          keyStageId={value ?? ""}
          initialName={selected?.name ?? ""}
          initialDescription={selected?.description ?? ""}
          onSuccess={() => {
            setIsUpdateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete key stage"
        bodyText="Are you sure you want to delete this key stage?"
        onConfirm={() => {
          if (value) {
            deleteKeyStage({ variables: { data: { id: Number(value) } } });
          }
        }}
        isLoading={deleting}
      />
    </>
  );
}

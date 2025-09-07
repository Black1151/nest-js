"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import CrudDropdown from "../CrudDropdown";

import { useQuery, useMutation, gql } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { BaseModal } from "@/components/modals/BaseModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { CreateYearGroupForm } from "./forms/CreateYearGroupForm";
import { UpdateYearGroupForm } from "./forms/UpdateYearGroupForm";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_YEAR_GROUPS_FOR_KEY_STAGE = typedGql("query")({
  getKeyStage: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      yearGroups: { id: true, year: true },
    },
  ],
} as const);

const CREATE_YEAR_GROUP = typedGql("mutation")({
  createYearGroup: [{ data: $("data", "CreateYearGroupInput!") }, { id: true }],
} as const);

const UPDATE_YEAR_GROUP = typedGql("mutation")({
  updateYearGroup: [{ data: $("data", "UpdateYearGroupInput!") }, { id: true }],
} as const);

const DELETE_YEAR_GROUP = gql`
  mutation DeleteYearGroup($data: IdInput!) {
    deleteYearGroup(data: $data)
  }
`;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface YearDropdownProps {
  keyStageId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function YearDropdown({
  keyStageId,
  value,
  onChange,
}: YearDropdownProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* -------- fetch -------- */
  const { data, loading, refetch } = useQuery(GET_YEAR_GROUPS_FOR_KEY_STAGE, {
    skip: keyStageId === null,
    variables:
      keyStageId !== null
        ? { data: { id: Number(keyStageId), relations: ["yearGroups"] } }
        : undefined,
  });

  const yearGroups =
    keyStageId !== null ? data?.getKeyStage?.yearGroups ?? [] : [];

  /* -------- options -------- */
  const options = useMemo(
    () =>
      yearGroups.map((yg) => ({
        label: yg.year,
        value: String(yg.id),
      })),
    [yearGroups]
  );

  const selected = yearGroups.find((yg) => String(yg.id) === value);

  const [createYearGroup] = useMutation(CREATE_YEAR_GROUP, {
    onCompleted: () => {
      setIsCreateOpen(false);
      refetch();
    },
  });

  const [updateYearGroup] = useMutation(UPDATE_YEAR_GROUP, {
    onCompleted: () => {
      setIsUpdateOpen(false);
      refetch();
    },
  });

  const [deleteYearGroup, { loading: deleting }] = useMutation(DELETE_YEAR_GROUP, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      onChange(null);
      refetch();
    },
  });

  /* -------- render -------- */
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
        isCreateDisabled={keyStageId === null}
        isUpdateDisabled={!value}
        isDeleteDisabled={!value}
        isDisabled={keyStageId === null}
      />

      <BaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Year Group"
      >
        <CreateYearGroupForm
          onSubmit={async (data) => {
            await createYearGroup({
              variables: {
                data: {
                  ...data,
                  keyStageId: keyStageId ? Number(keyStageId) : undefined,
                },
              },
            });
          }}
        />
      </BaseModal>

      <BaseModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Year Group"
      >
        <UpdateYearGroupForm
          initialData={{ id: Number(value), year: selected?.year }}
          onSubmit={async (data) => {
            await updateYearGroup({ variables: { data } });
          }}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete year group"
        bodyText="Are you sure you want to delete this year group?"
        onConfirm={() => {
          if (value) {
            deleteYearGroup({ variables: { data: { id: Number(value) } } });
          }
        }}
        isLoading={deleting}
      />
    </>
  );
}

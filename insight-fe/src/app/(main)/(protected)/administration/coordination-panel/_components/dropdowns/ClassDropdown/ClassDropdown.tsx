"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import CrudDropdown from "../CrudDropdown";
import { BaseModal } from "@/components/modals/BaseModal";
import { useQuery, useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { CreateClassForm } from "./forms/CreateClassForm";

/* -------------------------------------------------------------------------- */
/* GraphQL documents                                                          */
/* -------------------------------------------------------------------------- */
const GET_CLASSES_FOR_CONTEXT = typedGql("query")({
  getAllClass: [
    { data: $("data", "FindAllInput!") },
    { id: true, name: true, yearGroupId: true, subjectId: true },
  ],
} as const);

const CREATE_CLASS = typedGql("mutation")({
  createClass: [{ data: $("data", "CreateClassInput!") }, { id: true }],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface ClassDropdownProps {
  yearGroupId: string | null;
  subjectId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function ClassDropdown({
  yearGroupId,
  subjectId,
  value,
  onChange,
}: ClassDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* -------- variables for class list -------- */
  const variables = useMemo(() => {
    if (!yearGroupId || !subjectId) return undefined;
    return {
      data: {
        all: true,
        filters: [
          { column: "yearGroupId", value: String(yearGroupId) },
          { column: "subjectId", value: String(subjectId) },
        ],
      },
    };
  }, [yearGroupId, subjectId]);

  const { data, loading, refetch } = useQuery(GET_CLASSES_FOR_CONTEXT, {
    variables,
    skip: !yearGroupId || !subjectId,
  });

  const classes = data?.getAllClass ?? [];
  const options = useMemo(
    () => classes.map((c) => ({ label: c.name, value: String(c.id) })),
    [classes]
  );

  /* -------- create class mutation -------- */
  const [createClass, { loading: creating }] = useMutation(CREATE_CLASS, {
    onCompleted: async () => {
      setIsModalOpen(false);
      if (variables) await refetch(variables);
    },
  });

  const handleCreate = async ({ name }: { name: string }) => {
    await createClass({
      variables: {
        data: {
          name: name.trim(),
          yearGroupId: Number(yearGroupId),
          subjectId: Number(subjectId),
        },
      },
    });
  };

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
        onCreate={() => setIsModalOpen(true)}
        onUpdate={() => {}}
        onDelete={() => {}}
        isUpdateDisabled
        isDeleteDisabled
        isDisabled={!yearGroupId || !subjectId}
      />

      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Class"
      >
        <CreateClassForm onSubmit={handleCreate} />
        {creating && <p className="text-sm mt-2">Creating class…</p>}
      </BaseModal>
    </>
  );
}

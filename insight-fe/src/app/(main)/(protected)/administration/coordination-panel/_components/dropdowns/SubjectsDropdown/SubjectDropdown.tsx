// src/app/(main)/[protected]/administration/coordination-panel/_components/dropdowns/SubjectsDropdown/SubjectDropdown.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { Text } from "@chakra-ui/react";
import CrudDropdown from "../CrudDropdown";
import { BaseModal } from "@/components/modals/BaseModal";
import CreateSubjectForm from "./forms/CreateSubjectForm";
// import UpdateSubjectForm from "./forms/UpdateSubjectForm";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_SUBJECTS_FOR_YEAR_GROUP = typedGql("query")({
  getYearGroup: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      subjects: { id: true, name: true },
    },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface SubjectDropdownProps {
  yearGroupId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function SubjectDropdown({
  yearGroupId,
  value,
  onChange,
}: SubjectDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");

  /* ── variable memo ─────────────────────────────────────────────────────── */
  const variables = useMemo(
    () =>
      yearGroupId !== null
        ? { data: { id: Number(yearGroupId), relations: ["subjects"] } }
        : undefined,
    [yearGroupId]
  );

  /* ── subject list for the chosen Year Group ────────────────────────────── */
  const { data, refetch, loading } = useQuery(GET_SUBJECTS_FOR_YEAR_GROUP, {
    variables,
    skip: !yearGroupId, // do not run until we actually have an ID
  });

  const subjects = yearGroupId ? data?.getYearGroup?.subjects ?? [] : [];

  const options = useMemo(
    () => subjects.map((s) => ({ label: s.name, value: String(s.id) })),
    [subjects]
  );

  /* ── handlers triggered by forms ───────────────────────────────────────── */
  const handleSubjectCreated = async () => {
    setIsModalOpen(false);
    if (variables) {
      await refetch(variables); // always pass variables!
    }
  };

  const handleSubjectUpdated = async () => {
    setIsModalOpen(false);
    if (variables) {
      await refetch(variables); // always pass variables!
    }
  };

  /* ── render ────────────────────────────────────────────────────────────── */
  return (
    <>
      <CrudDropdown
        options={options}
        value={value ?? ""}
        isLoading={loading}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value || null)
        }
        onCreate={() => {
          setModalType("create");
          setIsModalOpen(true);
        }}
        onUpdate={() => {
          setModalType("update");
          setIsModalOpen(true);
        }}
        onDelete={() => {}}
        isUpdateDisabled={value === null}
        isDeleteDisabled
      />

      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "create" ? "Create Subject" : "Update Subject"}
      >
        {modalType === "create" ? (
          <CreateSubjectForm onSuccess={handleSubjectCreated} />
        ) : (
          <Text>Update Subject</Text>
          // <UpdateSubjectForm
          //   subjectId={String(value!)}
          //   onSuccess={handleSubjectUpdated}
          // />
        )}
      </BaseModal>
    </>
  );
}

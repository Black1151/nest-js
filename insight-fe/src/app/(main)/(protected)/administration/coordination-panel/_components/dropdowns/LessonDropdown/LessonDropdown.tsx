// src/app/(main)/[protected]/administration/coordination-panel/_components/dropdowns/SubjectsDropdown/SubjectDropdown.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { Text } from "@chakra-ui/react";
import CrudDropdown from "../CrudDropdown";
import { BaseModal } from "@/components/modals/BaseModal";
// import CreateSubjectForm from "./forms/CreateSubjectForm";
// import UpdateSubjectForm from "./forms/UpdateSubjectForm";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_LESSONS_FOR_TOPIC = typedGql("query")({
  getTopic: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      lessons: { id: true, name: true },
    },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface LessonDropdownProps {
  topicId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function LessonDropdown({
  topicId,
  value,
  onChange,
}: LessonDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");

  /* ── variable memo ─────────────────────────────────────────────────────── */
  const variables = useMemo(
    () =>
      topicId !== null
        ? { data: { id: Number(topicId), relations: ["lessons"] } }
        : undefined,
    [topicId]
  );

  /* ── subject list for the chosen Year Group ────────────────────────────── */
  const { data, refetch, loading } = useQuery(GET_LESSONS_FOR_TOPIC, {
    variables,
    skip: !topicId, // do not run until we actually have an ID
  });

  const lessons = topicId ? data?.getTopic?.lessons ?? [] : [];

  const options = useMemo(
    () => lessons.map((l) => ({ label: String(l.name), value: String(l.id) })),
    [lessons]
  );

  /* ── handlers triggered by forms ───────────────────────────────────────── */
  const handleLessonCreated = async () => {
    setIsModalOpen(false);
    if (variables) {
      await refetch(variables); // always pass variables!
    }
  };

  const handleLessonUpdated = async () => {
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

      {/* <BaseModal
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
      </BaseModal> */}
    </>
  );
}

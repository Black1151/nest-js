"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import CrudDropdown from "../CrudDropdown";

import { gql, useQuery, useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { BaseModal } from "@/components/modals/BaseModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CreateLessonForm from "./forms/CreateLessonForm";
import UpdateLessonForm from "./forms/UpdateLessonForm";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_LESSONS_FOR_TOPIC = typedGql("query")({
  getTopic: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      lessons: { id: true, title: true, description: true },
    },
  ],
} as const);

const DELETE_LESSON = gql`
  mutation DeleteLesson($data: IdInput!) {
    deleteLesson(data: $data)
  }
`;

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* -------- fetch -------- */
  const { data, loading, refetch } = useQuery(GET_LESSONS_FOR_TOPIC, {
    skip: topicId === null,
    variables:
      topicId !== null
        ? { data: { id: Number(topicId), relations: ["lessons"] } }
        : undefined,
  });

  const [deleteLesson, { loading: deleting }] = useMutation(DELETE_LESSON, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      refetch();
      onChange(null);
    },
  });

  const lessons = topicId !== null ? data?.getTopic?.lessons ?? [] : [];

  /* -------- options -------- */
  const options = useMemo(
    () =>
      lessons.map((les) => ({
        label: les.title,
        value: String(les.id),
      })),
    [lessons]
  );

  const selectedLesson = lessons.find((l) => String(l.id) === value);

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
        isCreateDisabled={topicId === null}
        isUpdateDisabled={!value}
        isDeleteDisabled={!value}
        isDisabled={topicId === null}
      />

      <BaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Lesson"
      >
        <CreateLessonForm
          topicId={topicId ?? ""}
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <BaseModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Lesson"
      >
        <UpdateLessonForm
          lessonId={value ?? ""}
          initialTitle={selectedLesson?.title ?? ""}
          initialDescription={selectedLesson?.description ?? ""}
          onSuccess={() => {
            setIsUpdateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete lesson"
        bodyText="Are you sure you want to delete this lesson?"
        onConfirm={() => {
          if (value) {
            deleteLesson({ variables: { data: { id: Number(value) } } });
          }
        }}
        isLoading={deleting}
      />
    </>
  );
}


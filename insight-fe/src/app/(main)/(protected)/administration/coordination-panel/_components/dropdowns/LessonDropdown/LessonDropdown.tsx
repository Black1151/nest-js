"use client";

import { ChangeEvent, useMemo, useState } from "react";
import CrudDropdown from "../CrudDropdown";
import { BaseModal } from "@/components/modals/BaseModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CreateLessonForm from "./forms/CreateLessonForm";
import UpdateLessonForm from "./forms/UpdateLessonForm";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_LESSONS_BY_TOPIC = gql`
  query LessonsByTopic($topicId: ID!) {
    lessonsByTopic(topicId: $topicId) {
      id
      title
    }
  }
`;

const DELETE_LESSON = gql`
  mutation DeleteLesson($data: IdInput!) {
    deleteLesson(data: $data)
  }
`;

interface LessonDropdownProps {
  topicId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function LessonDropdown({ topicId, value, onChange }: LessonDropdownProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, loading, refetch } = useQuery(GET_LESSONS_BY_TOPIC, {
    variables: topicId ? { topicId } : undefined,
    skip: !topicId,
  });

  const [deleteLesson, { loading: deleting }] = useMutation(DELETE_LESSON, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      refetch();
      onChange(null);
    },
  });

  const lessons = topicId ? data?.lessonsByTopic ?? [] : [];
  const selectedLesson = lessons.find((l: any) => String(l.id) === value);

  const options = useMemo(
    () => lessons.map((l: any) => ({ label: l.title, value: String(l.id) })),
    [lessons]
  );

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
        isDisabled={!topicId}
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

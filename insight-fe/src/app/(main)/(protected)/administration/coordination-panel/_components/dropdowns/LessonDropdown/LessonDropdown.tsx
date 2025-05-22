"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import CrudDropdown from "../CrudDropdown";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

const GET_LESSONS_BY_TOPIC = typedGql("query")({
  getAllLesson: [
    { data: $("data", "FindAllInput!") }, // { filters: [{ column: 'topicId', value }], all: true }
    { id: true, title: true },
  ],
} as const);

interface LessonDropdownProps {
  topicId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function LessonDropdown({ topicId, value, onChange }: LessonDropdownProps) {
  const variables = useMemo(
    () =>
      topicId
        ? {
            data: {
              filters: [{ column: 'topicId', value: topicId }],
              all: true,
            },
          }
        : undefined,
    [topicId],
  );

  const { data, loading } = useQuery(GET_LESSONS_BY_TOPIC, {
    skip: !topicId,
    variables,
  });

  const lessons = topicId ? data?.getAllLesson ?? [] : [];

  const options = useMemo(
    () => lessons.map((l: any) => ({ label: l.title, value: String(l.id) })),
    [lessons]
  );

  return (
    <CrudDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value || null)
      }
      onCreate={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
      isCreateDisabled
      isUpdateDisabled
      isDeleteDisabled
      isDisabled={!topicId}
    />
  );
}

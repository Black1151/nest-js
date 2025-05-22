"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import CrudDropdown from "../CrudDropdown";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

const GET_LESSONS_BY_TOPIC = typedGql("query")({
  lessonsByTopic: [
    { input: $("input", "LessonByTopicInput!") },
    { id: true, title: true },
  ],
} as const);

interface LessonDropdownProps {
  topicId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function LessonDropdown({ topicId, value, onChange }: LessonDropdownProps) {
  const { data, loading } = useQuery(GET_LESSONS_BY_TOPIC, {
    skip: !topicId,
    variables: topicId ? { input: { topicId } } : undefined,
  });

  const lessons = topicId ? data?.lessonsByTopic ?? [] : [];

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

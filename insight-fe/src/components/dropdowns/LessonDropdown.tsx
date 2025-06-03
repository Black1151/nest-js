"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import SimpleDropdown from "./SimpleDropdown";

const GET_LESSONS_FOR_TOPIC = typedGql("query")({
  getTopic: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      lessons: { id: true, title: true },
    },
  ],
} as const);

interface LessonDropdownProps {
  topicId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export default function LessonDropdown({ topicId, value, onChange }: LessonDropdownProps) {
  const variables = useMemo(
    () =>
      topicId !== null
        ? { data: { id: Number(topicId), relations: ["lessons"] } }
        : undefined,
    [topicId]
  );

  const { data, loading } = useQuery(GET_LESSONS_FOR_TOPIC, {
    variables,
    skip: topicId === null,
  });

  const lessons = topicId !== null ? data?.getTopic?.lessons ?? [] : [];

  const options = useMemo(
    () => lessons.map((l: any) => ({ label: l.title, value: String(l.id) })),
    [lessons]
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value || null)
      }
      isDisabled={topicId === null}
    />
  );
}

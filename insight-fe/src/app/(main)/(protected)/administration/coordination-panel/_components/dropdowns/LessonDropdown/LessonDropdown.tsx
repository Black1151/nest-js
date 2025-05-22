"use client";

import React, { ChangeEvent, useMemo } from "react";
import CrudDropdown from "../CrudDropdown";

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
      lessons: { id: true, title: true },
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
  /* -------- fetch -------- */
  const { data, loading } = useQuery(GET_LESSONS_FOR_TOPIC, {
    skip: topicId === null,
    variables:
      topicId !== null
        ? { data: { id: Number(topicId), relations: ["lessons"] } }
        : undefined,
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

  /* -------- render -------- */
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
      isDisabled={topicId === null}
    />
  );
}


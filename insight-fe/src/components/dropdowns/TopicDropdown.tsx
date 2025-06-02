"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import SimpleDropdown from "./SimpleDropdown";

const GET_TOPICS_BY_YEAR_SUBJECT = typedGql("query")({
  topicsByYearAndSubject: [
    { input: $("input", "TopicByYearSubjectInput!") },
    { id: true, name: true },
  ],
} as const);

interface TopicDropdownProps {
  yearGroupId: string | null;
  subjectId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export default function TopicDropdown({
  yearGroupId,
  subjectId,
  value,
  onChange,
}: TopicDropdownProps) {
  const variables = useMemo(
    () =>
      yearGroupId && subjectId
        ? { input: { yearGroupId, subjectId } }
        : undefined,
    [yearGroupId, subjectId]
  );

  const { data, loading } = useQuery(GET_TOPICS_BY_YEAR_SUBJECT, {
    variables,
    skip: !(yearGroupId && subjectId),
  });

  const topics = yearGroupId && subjectId ? data?.topicsByYearAndSubject ?? [] : [];

  const options = useMemo(
    () => topics.map((t: any) => ({ label: t.name, value: String(t.id) })),
    [topics]
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value || null)
      }
      isDisabled={!(yearGroupId && subjectId)}
    />
  );
}

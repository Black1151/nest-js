"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import SimpleDropdown from "./SimpleDropdown";

const GET_SUBJECTS_FOR_YEAR_GROUP = typedGql("query")({
  getYearGroup: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      subjects: { id: true, name: true },
    },
  ],
} as const);

interface SubjectDropdownProps {
  yearGroupId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export default function SubjectDropdown({ yearGroupId, value, onChange }: SubjectDropdownProps) {
  const variables = useMemo(
    () =>
      yearGroupId !== null
        ? { data: { id: Number(yearGroupId), relations: ["subjects"] } }
        : undefined,
    [yearGroupId]
  );

  const { data, loading } = useQuery(GET_SUBJECTS_FOR_YEAR_GROUP, {
    variables,
    skip: !yearGroupId,
  });

  const subjects = yearGroupId ? data?.getYearGroup?.subjects ?? [] : [];

  const options = useMemo(
    () => subjects.map((s) => ({ label: s.name, value: String(s.id) })),
    [subjects]
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value || null)
      }
      isDisabled={yearGroupId === null}
    />
  );
}

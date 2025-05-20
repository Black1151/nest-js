"use client";

import React, { ChangeEvent, useMemo } from "react";
import CrudDropdown from "../CrudDropdown";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_CLASSES = typedGql("query")({
  getAllClass: [
    { data: $("data", "FindAllInput!") },
    { id: true, name: true, subjectId: true, yearGroupId: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface ClassDropdownProps {
  yearGroupId: string | null;
  subjectId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function ClassDropdown({
  yearGroupId,
  subjectId,
  value,
  onChange,
}: ClassDropdownProps) {
  const variables = useMemo(
    () =>
      yearGroupId && subjectId
        ? {
            data: {
              all: true,
              filters: [
                { column: "yearGroupId", value: String(yearGroupId) },
                { column: "subjectId", value: String(subjectId) },
              ],
            },
          }
        : undefined,
    [yearGroupId, subjectId]
  );

  const { data, loading } = useQuery(GET_CLASSES, {
    variables,
    skip: !(yearGroupId && subjectId),
  });

  const classes = yearGroupId && subjectId ? data?.getAllClass ?? [] : [];

  const options = useMemo(
    () => classes.map((c) => ({ label: c.name, value: String(c.id) })),
    [classes]
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
      isDisabled={!(yearGroupId && subjectId)}
    />
  );
}

"use client";

import React, { ChangeEvent, useMemo } from "react";
import CrudDropdown from "../CrudDropdown";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_YEAR_GROUPS_FOR_KEY_STAGE = typedGql("query")({
  getKeyStage: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      yearGroups: { id: true, year: true },
    },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface YearDropdownProps {
  keyStageId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function YearDropdown({
  keyStageId,
  value,
  onChange,
}: YearDropdownProps) {
  /* -------- fetch -------- */
  const { data, loading } = useQuery(GET_YEAR_GROUPS_FOR_KEY_STAGE, {
    skip: keyStageId === null,
    variables:
      keyStageId !== null
        ? { data: { id: Number(keyStageId), relations: ["yearGroups"] } }
        : undefined,
  });

  const yearGroups =
    keyStageId !== null ? data?.getKeyStage?.yearGroups ?? [] : [];

  /* -------- options -------- */
  const options = useMemo(
    () =>
      yearGroups.map((yg) => ({
        label: yg.year,
        value: String(yg.id),
      })),
    [yearGroups]
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
      isDisabled={keyStageId === null}
    />
  );
}

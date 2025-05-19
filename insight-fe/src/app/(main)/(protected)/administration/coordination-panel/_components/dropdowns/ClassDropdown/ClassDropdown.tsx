"use client";

import React, { ChangeEvent, useEffect, useMemo } from "react";
import CrudDropdown from "../CrudDropdown";

import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { YearGroupEntity } from "@/__generated__/schema-types";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_YEAR_GROUPS_BY_KEY_STAGE = typedGql("query")({
  getAllYearGroup: [
    { data: $("data", "FindAllInput!") }, // { all, filters }
    { id: true, year: true, keyStageId: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface YearDropdownProps {
  keyStageId: number | null; // selected KS id from parent
  value: number | null; // current YearGroup id
  onChange: (id: number | null) => void;
}

export function YearDropdown({
  keyStageId,
  value,
  onChange,
}: YearDropdownProps) {
  /* -------- fetch -------- */
  const { data, loading } = useQuery(GET_YEAR_GROUPS_BY_KEY_STAGE, {
    skip: keyStageId === null,
    variables:
      keyStageId !== null
        ? {
            data: {
              all: true,
              filters: [{ column: "keyStageId", value: String(keyStageId) }],
            },
          }
        : undefined,
  });

  const yearGroups = keyStageId !== null ? data?.getAllYearGroup ?? [] : [];

  /* -------- options -------- */
  const options = useMemo(
    () =>
      yearGroups.map((yg) => ({
        label: yg.year,
        value: String(yg.id),
      })),
    [yearGroups]
  );

  /* -------- clear invalid selection if KS changes -------- */
  useEffect(() => {
    if (value !== null && !options.some((o) => o.value === String(value))) {
      onChange(null);
    }
  }, [options, value, onChange]);

  /* -------- render -------- */
  return (
    <CrudDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value ? Number(e.target.value) : null)
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

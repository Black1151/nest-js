"use client";

import React, { ChangeEvent, useEffect, useMemo } from "react";
import CrudDropdown from "../CrudDropdown";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_ALL_KEY_STAGES = typedGql("query")({
  getAllKeyStage: [
    { data: $("data", "FindAllInput!") }, // { all: true }
    { id: true, name: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface KeyStageDropdownProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

export function KeyStageDropdown({ value, onChange }: KeyStageDropdownProps) {
  /* ---------- list (fetched once, cached by Apollo) ---------- */
  const { data, loading } = useQuery(GET_ALL_KEY_STAGES, {
    variables: { data: { all: true } },
  });

  const keyStages = data?.getAllKeyStage ?? [];

  /* ---------- options ---------- */
  const options = useMemo(
    () =>
      keyStages.map((ks) => ({
        label: ks.name ?? "",
        value: String(ks.id), // GraphQL ID → string
      })),
    [keyStages]
  );

  useEffect(() => {
    console.log(options);
  }, [options]);

  /* ---------- render ---------- */
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
    />
  );
}

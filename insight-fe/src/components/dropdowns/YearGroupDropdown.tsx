"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";

const GET_ALL_YEAR_GROUPS = typedGql("query")({
  getAllYearGroup: [
    { data: $("data", "FindAllInput!") },
    { id: true, year: true },
  ],
} as const);

interface YearGroupDropdownProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

export default function YearGroupDropdown({ value, onChange }: YearGroupDropdownProps) {
  const { data, loading } = useQuery(GET_ALL_YEAR_GROUPS, {
    variables: { data: { all: true } },
  });

  const yearGroups = data?.getAllYearGroup ?? [];

  const options = useMemo(
    () => yearGroups.map((yg) => ({ label: yg.year, value: String(yg.id) })),
    [yearGroups]
  );

  return (
    <CrudDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value || null)}
      onCreate={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
      isCreateDisabled
      isUpdateDisabled
      isDeleteDisabled
    />
  );
}

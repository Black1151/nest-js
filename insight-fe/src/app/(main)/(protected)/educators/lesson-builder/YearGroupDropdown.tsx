"use client";

import React, { ChangeEvent, useMemo } from "react";
import { Select } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

const GET_ALL_YEAR_GROUPS = typedGql("query")({
  getAllYearGroup: [
    { data: $("data", "FindAllInput!") },
    { id: true, year: true },
  ],
} as const);

export interface YearGroupDropdownProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

export default function YearGroupDropdown({ value, onChange }: YearGroupDropdownProps) {
  const { data, loading } = useQuery(GET_ALL_YEAR_GROUPS, {
    variables: { data: { all: true } },
  });

  const options = useMemo(
    () => (data?.getAllYearGroup ?? []).map((yg) => ({
      label: yg.year,
      value: String(yg.id),
    })),
    [data]
  );

  return (
    <Select
      placeholder={loading ? "Loading..." : "Select year group"}
      value={value ?? ""}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value || null)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_THEMES } from "@/graphql/lesson";
import SimpleDropdown from "./SimpleDropdown";

export interface ThemeOption {
  id: number;
  name: string;
  styleCollectionId: number;
  defaultPaletteId: number;
}

interface ThemeDropdownProps {
  value: string | null;
  onChange: (theme: ThemeOption | null) => void;
}

export default function ThemeDropdown({ value, onChange }: ThemeDropdownProps) {
  const { data, loading } = useQuery(GET_ALL_THEMES);

  const themes: ThemeOption[] = useMemo(
    () =>
      (data?.getAllTheme ?? []).map((t: any) => ({
        id: Number(t.id),
        name: t.name,
        styleCollectionId: Number(t.styleCollectionId),
        defaultPaletteId: Number(t.defaultPaletteId),
      })),
    [data]
  );

  const options = useMemo(
    () => themes.map((t) => ({ label: t.name, value: String(t.id) })),
    [themes]
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const theme = themes.find((t) => String(t.id) === val) || null;
        onChange(theme);
      }}
    />
  );
}

"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_THEMES } from "@/graphql/lesson";
import SimpleDropdown from "./SimpleDropdown";

interface ThemeDropdownProps {
  value: string | null;
  onChange: (id: string | null) => void;
  isDisabled?: boolean;
}

export default function ThemeDropdown({
  value,
  onChange,
  isDisabled = false,
}: ThemeDropdownProps) {
  const { data, loading } = useQuery(GET_ALL_THEMES);

  const themes = data?.getAllTheme ?? [];

  const options = useMemo(
    () => themes.map((t: any) => ({ label: t.name, value: String(t.id) })),
    [themes]
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value || null)
      }
      isDisabled={isDisabled}
    />
  );
}


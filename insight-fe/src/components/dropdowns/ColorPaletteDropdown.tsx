"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_COLOR_PALETTES } from "@/graphql/lesson";
import SimpleDropdown from "./SimpleDropdown";

interface ColorPaletteDropdownProps {
  collectionId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
  isDisabled?: boolean;
}

export default function ColorPaletteDropdown({
  collectionId,
  value,
  onChange,
  isDisabled = false,
}: ColorPaletteDropdownProps) {
  const variables = useMemo(
    () => (collectionId ? { collectionId: String(collectionId) } : undefined),
    [collectionId]
  );

  const { data, loading } = useQuery(GET_COLOR_PALETTES, {
    variables,
    skip: !collectionId,
  });

  const palettes = collectionId ? data?.getAllColorPalette ?? [] : [];

  const options = useMemo(
    () => palettes.map((p: any) => ({ label: p.name, value: String(p.id) })),
    [palettes]
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value || null)
      }
      isDisabled={isDisabled || !collectionId}
    />
  );
}


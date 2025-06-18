"use client";

import { ChangeEvent, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_COLOR_PALETTES } from "@/graphql/lesson";
import SimpleDropdown from "./SimpleDropdown";

export interface ColorPaletteOption {
  id: number;
  name: string;
}

interface ColorPaletteDropdownProps {
  collectionId: number | null;
  value: string | null;
  onChange: (palette: ColorPaletteOption | null) => void;
}

export default function ColorPaletteDropdown({
  collectionId,
  value,
  onChange,
}: ColorPaletteDropdownProps) {
  const { data, loading } = useQuery(GET_COLOR_PALETTES, {
    variables: { collectionId: String(collectionId) },
    skip: collectionId === null,
    fetchPolicy: "network-only",
  });

  const palettes: ColorPaletteOption[] = useMemo(
    () =>
      (data?.getAllColorPalette ?? []).map((p: any) => ({
        id: Number(p.id),
        name: p.name,
      })),
    [data]
  );

  const options = useMemo(
    () => palettes.map((p) => ({ label: p.name, value: String(p.id) })),
    [palettes]
  );

  // Reset selection when collection changes
  useEffect(() => {
    onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isDisabled={collectionId === null}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const palette = palettes.find((p) => String(p.id) === val) || null;
        onChange(palette);
      }}
    />
  );
}

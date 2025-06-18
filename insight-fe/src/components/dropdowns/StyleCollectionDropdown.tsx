"use client";

import { ChangeEvent, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_STYLE_COLLECTIONS } from "@/graphql/lesson";
import SimpleDropdown from "./SimpleDropdown";

export interface StyleCollectionOption {
  id: number;
  name: string;
}

interface StyleCollectionDropdownProps {
  value: string | null;
  onChange: (collection: StyleCollectionOption | null) => void;
}

export default function StyleCollectionDropdown({
  value,
  onChange,
}: StyleCollectionDropdownProps) {
  const { data, loading } = useQuery(GET_STYLE_COLLECTIONS);

  const collections: StyleCollectionOption[] = useMemo(
    () =>
      (data?.getAllStyleCollection ?? []).map((c: any) => ({
        id: Number(c.id),
        name: c.name,
      })),
    [data],
  );

  const options = useMemo(
    () => collections.map((c) => ({ label: c.name, value: String(c.id) })),
    [collections],
  );

  return (
    <SimpleDropdown
      options={options}
      value={value ?? ""}
      isLoading={loading}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const collection =
          collections.find((c) => String(c.id) === val) || null;
        onChange(collection);
      }}
    />
  );
}

"use client";

import React from "react";
import { Select, useColorModeValue } from "@chakra-ui/react";

export interface SimpleDropdownOption {
  label: string;
  value: string;
}

interface SimpleDropdownProps {
  options: SimpleDropdownOption[];
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export default function SimpleDropdown({
  options,
  value,
  onChange,
  isDisabled = false,
  isLoading = false,
}: SimpleDropdownProps) {
  const dedupedOptions = React.useMemo(() => {
    const seen = new Set<string | number>();
    return options.filter((o) => {
      if (o.value === undefined || seen.has(o.value)) return false;
      seen.add(o.value);
      return true;
    });
  }, [options]);

  return (
    <Select
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      bg={useColorModeValue("white", "gray.800")}
      _hover={{ shadow: "sm" }}
      _focus={{ shadow: "outline" }}
    >
      {isLoading && <option value="">Loading...</option>}
      {!isLoading && (
        <option key="__empty" value="">
          ─ select ─
        </option>
      )}
      {dedupedOptions.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

export interface ThemeInfo {
  id: number;
  name: string;
  defaultPaletteId: number;
}

interface LoadThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: ThemeInfo[];
  onLoad: (theme: ThemeInfo) => void;
}

export default function LoadThemeModal({
  isOpen,
  onClose,
  themes,
  onLoad,
}: LoadThemeModalProps) {
  const [themeId, setThemeId] = useState<number | "">("");

  useEffect(() => {
    if (isOpen) {
      setThemeId("");
    }
  }, [isOpen]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Load Theme">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Select Theme</FormLabel>
          <Select
            placeholder="Select theme"
            value={themeId}
            onChange={(e) => {
              const val = e.target.value;
              setThemeId(val === "" ? "" : parseInt(val, 10));
            }}
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={themeId === ""}
          onClick={() => {
            if (themeId === "") return;
            const theme = themes.find((t) => t.id === themeId);
            if (theme) {
              onLoad(theme);
            }
          }}
        >
          Load
        </Button>
      </Stack>
    </BaseModal>
  );
}

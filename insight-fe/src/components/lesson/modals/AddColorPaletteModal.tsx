"use client";

import { useState, useEffect } from "react";

const DEFAULT_COLOR = "#000000";
import {
  Button,
  HStack,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_COLOR_PALETTE,
  UPDATE_COLOR_PALETTE,
  GET_COLOR_PALETTE,
} from "@/graphql/lesson";

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: number;
  tokens: string[];
  onSave?: (palette: { id: number; name: string; colors: Record<string, string> }) => void;
  /** Pre-populated palette name */
  initialName?: string;
  /** Pre-populated list of colors */
  initialColors?: Record<string, string>;
  /** Existing palette id for updates */
  paletteId?: number;
  /** Modal title */
  title?: string;
  /** Confirmation button label */
  confirmLabel?: string;
}

export default function ColorPaletteModal({
  isOpen,
  onClose,
  collectionId,
  tokens,
  onSave,
  initialName = "",
  initialColors = {},
  paletteId,
  title = "Add Color Palette",
  confirmLabel = "Save",
}: ColorPaletteModalProps) {
  const [name, setName] = useState(initialName);
  const [colors, setColors] = useState<Record<string, string>>(() => {
    if (Object.keys(initialColors).length > 0) return { ...initialColors };
    return Object.fromEntries(tokens.map((t) => [t, DEFAULT_COLOR]));
  });

  const { data: paletteData } = useQuery(GET_COLOR_PALETTE, {
    variables: { id: String(paletteId) },
    skip: !paletteId || !isOpen,
    fetchPolicy: "network-only",
  });

  const palette = paletteData?.getColorPalette;

  const [createPalette, { loading: creating }] = useMutation(CREATE_COLOR_PALETTE);
  const [updatePalette, { loading: updating }] = useMutation(UPDATE_COLOR_PALETTE);

  const loading = creating || updating;

  // Reset fields when the modal opens or when the initial values or palette
  // data change. Using the palette id ensures this effect only runs when new
  // palette data is fetched rather than on every render.
  useEffect(() => {
    if (!isOpen) return;

    if (paletteId && palette) {
      setName(palette.name);
      setColors({ ...palette.colors });
    } else {
      setName(initialName);
      setColors(
        Object.keys(initialColors).length > 0
          ? { ...initialColors }
          : Object.fromEntries(tokens.map((t) => [t, DEFAULT_COLOR]))
      );
    }
  }, [isOpen, initialName, initialColors, paletteId, palette?.id, tokens]);

  const handleColorChange = (token: string, value: string) => {
    setColors((cols) => ({ ...cols, [token]: value }));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={async () => {
              if (paletteId) {
                const { data } = await updatePalette({
                  variables: {
                    data: { id: paletteId, name, colors },
                  },
                });
                if (data?.updateColorPalette) {
                  onSave?.({
                    id: Number(data.updateColorPalette.id),
                    name: data.updateColorPalette.name,
                    colors: data.updateColorPalette.colors,
                  });
                }
              } else {
                const { data } = await createPalette({
                  variables: {
                    data: { name, colors, collectionId },
                  },
                });
                if (data?.createColorPalette) {
                  onSave?.({
                    id: Number(data.createColorPalette.id),
                    name: data.createColorPalette.name,
                    colors: data.createColorPalette.colors,
                  });
                  setName("");
                  setColors(Object.fromEntries(tokens.map((t) => [t, DEFAULT_COLOR])));
                }
              }
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <VStack align="stretch" spacing={2}>
        <Input
          placeholder="Palette name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {tokens.map((t) => (
          <HStack key={t}>
            <Input
              type="color"
              value={colors[t] ?? DEFAULT_COLOR}
              onChange={(e) => handleColorChange(t, e.target.value)}
              w="40px"
              h="40px"
              p={0}
            />
            <Text>{t}</Text>
          </HStack>
        ))}
      </VStack>
    </BaseModal>
  );
}


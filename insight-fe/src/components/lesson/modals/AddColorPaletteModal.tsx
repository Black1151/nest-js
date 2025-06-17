"use client";

import { useState, useEffect } from "react";

const DEFAULT_COLORS = ["#000000"];
import {
  Button,
  HStack,
  Input,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { Plus, Trash2 } from "lucide-react";
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
  themeId: number;
  onSave?: (palette: { id: number; name: string; colors: string[] }) => void;
  /** Pre-populated palette name */
  initialName?: string;
  /** Pre-populated list of colors */
  initialColors?: string[];
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
  themeId,
  onSave,
  initialName = "",
  initialColors = DEFAULT_COLORS,
  paletteId,
  title = "Add Color Palette",
  confirmLabel = "Save",
}: ColorPaletteModalProps) {
  const [name, setName] = useState(initialName);
  const [colors, setColors] = useState<string[]>(
    initialColors.length > 0 ? [...initialColors] : DEFAULT_COLORS
  );

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
      setColors(palette.colors.length > 0 ? [...palette.colors] : DEFAULT_COLORS);
    } else {
      setName(initialName);
      setColors(initialColors.length > 0 ? [...initialColors] : DEFAULT_COLORS);
    }
  }, [isOpen, initialName, initialColors, paletteId, palette?.id]);

  const handleColorChange = (idx: number, value: string) => {
    setColors((cols) => cols.map((c, i) => (i === idx ? value : c)));
  };

  const addColor = () => setColors((cols) => [...cols, "#000000"]);

  const removeColor = (idx: number) =>
    setColors((cols) => cols.filter((_, i) => i !== idx));

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
                    data: { id: paletteId, name, colors, themeId },
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
                    data: { name, colors, themeId },
                  },
                });
                if (data?.createColorPalette) {
                  onSave?.({
                    id: Number(data.createColorPalette.id),
                    name: data.createColorPalette.name,
                    colors: data.createColorPalette.colors,
                  });
                  setName("");
                  setColors(["#000000"]);
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
        {colors.map((color, idx) => (
          <HStack key={idx}>
            <Input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(idx, e.target.value)}
              w="40px"
              h="40px"
              p={0}
            />
            <IconButton
              aria-label="Remove color"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() => removeColor(idx)}
            />
          </HStack>
        ))}
        <Button leftIcon={<Plus size={16} />} size="sm" onClick={addColor}>
          Add Color
        </Button>
      </VStack>
    </BaseModal>
  );
}


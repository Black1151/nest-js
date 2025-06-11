"use client";

import { useState, useEffect } from "react";
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
  collectionId: number;
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
  collectionId,
  onSave,
  initialName = "",
  initialColors = ["#000000"],
  paletteId,
  title = "Add Color Palette",
  confirmLabel = "Save",
}: ColorPaletteModalProps) {
  const [name, setName] = useState(initialName);
  const [colors, setColors] = useState<string[]>(
    initialColors.length > 0 ? initialColors : ["#000000"]
  );
  const [initialized, setInitialized] = useState(false);

  const { data: paletteData } = useQuery(GET_COLOR_PALETTE, {
    variables: { id: String(paletteId) },
    skip: !paletteId || !isOpen,
    fetchPolicy: "network-only",
  });
  const palette = paletteData?.getColorPalette;

  const [createPalette, { loading: creating }] = useMutation(CREATE_COLOR_PALETTE);
  const [updatePalette, { loading: updating }] = useMutation(UPDATE_COLOR_PALETTE);

  const loading = creating || updating;

  // Initialize fields when the modal opens
  useEffect(() => {
    if (!isOpen) {
      setInitialized(false);
      return;
    }

    if (initialized) return;

    if (paletteId) {
      if (!palette) return; // wait for palette data
      setName(palette.name);
      setColors(
        palette.colors.length > 0 ? palette.colors : ["#000000"]
      );
    } else {
      setName(initialName);
      setColors(initialColors.length > 0 ? initialColors : ["#000000"]);
    }

    setInitialized(true);
  }, [isOpen, paletteId, palette, initialName, initialColors, initialized]);

  const handleColorChange = (idx: number, value: string) => {
    setColors((cols) => cols.map((c, i) => (i === idx ? value : c)));
    setInitialized(true);
  };

  const addColor = () => {
    setColors((cols) => [...cols, "#000000"]);
    setInitialized(true);
  };

  const removeColor = (idx: number) => {
    setColors((cols) => cols.filter((_, i) => i !== idx));
    setInitialized(true);
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
          onChange={(e) => {
            setName(e.target.value);
            setInitialized(true);
          }}
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


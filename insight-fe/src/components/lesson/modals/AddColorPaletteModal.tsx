"use client";

import { useState } from "react";
import {
  Button,
  HStack,
  Input,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { Plus, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/modals/BaseModal";
import { gql, useMutation } from "@apollo/client";
import { CREATE_COLOR_PALETTE } from "@/graphql/lesson";

interface AddColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: number;
  onSave?: (palette: { id: number; name: string; colors: string[] }) => void;
}

export default function AddColorPaletteModal({
  isOpen,
  onClose,
  collectionId,
  onSave,
}: AddColorPaletteModalProps) {
  const [name, setName] = useState("");
  const [colors, setColors] = useState<string[]>(["#000000"]);

  const [createPalette] = useMutation(CREATE_COLOR_PALETTE);

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
      title="Add Color Palette"
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            onClick={async () => {
              const { data } = await createPalette({
                variables: {
                  data: { name, colors, collectionId },
                },
              });
              if (data?.createColorPalette) {
                onSave?.(data.createColorPalette);
                setName("");
                setColors(["#000000"]);
              }
              onClose();
            }}
          >
            Save
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


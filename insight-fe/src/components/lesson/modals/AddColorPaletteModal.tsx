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
  onSave?: (palette: { id: number; name: string; tokens: { token: string; color: string }[] }) => void;
  /** Pre-populated palette name */
  initialName?: string;
  /** Pre-populated list of tokens */
  initialTokens?: { token: string; color: string }[];
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
  initialTokens = [{ token: "", color: "#000000" }],
  paletteId,
  title = "Add Color Palette",
  confirmLabel = "Save",
}: ColorPaletteModalProps) {
  const [name, setName] = useState(initialName);
  const [tokens, setTokens] = useState<{ token: string; color: string }[]>(
    initialTokens.length > 0 ? initialTokens : [{ token: "", color: "#000000" }]
  );

  const { data: paletteData } = useQuery(GET_COLOR_PALETTE, {
    variables: { id: String(paletteId) },
    skip: !paletteId || !isOpen,
    fetchPolicy: "network-only",
  });

  const [createPalette, { loading: creating }] = useMutation(CREATE_COLOR_PALETTE);
  const [updatePalette, { loading: updating }] = useMutation(UPDATE_COLOR_PALETTE);

  const loading = creating || updating;

  // Reset fields when the modal opens or initial values change
  useEffect(() => {
    if (!isOpen) return;

    if (paletteId && paletteData?.getColorPalette) {
      setName(paletteData.getColorPalette.name);
      setTokens(
        paletteData.getColorPalette.tokens.length > 0
          ? paletteData.getColorPalette.tokens
          : [{ token: "", color: "#000000" }]
      );
    } else {
      setName(initialName);
      setTokens(initialTokens.length > 0 ? initialTokens : [{ token: "", color: "#000000" }]);
    }
  }, [isOpen, initialName, initialTokens, paletteId, paletteData]);

  const handleTokenChange = (idx: number, field: 'token' | 'color', value: string) => {
    setTokens((toks) =>
      toks.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  };

  const addToken = () =>
    setTokens((toks) => [...toks, { token: "", color: "#000000" }]);

  const removeToken = (idx: number) =>
    setTokens((toks) => toks.filter((_, i) => i !== idx));

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
                    data: { id: paletteId, name, tokens },
                  },
                });
                if (data?.updateColorPalette) {
                  onSave?.({
                    id: Number(data.updateColorPalette.id),
                    name: data.updateColorPalette.name,
                    tokens: data.updateColorPalette.tokens,
                  });
                }
              } else {
                const { data } = await createPalette({
                  variables: {
                    data: { name, tokens, collectionId },
                  },
                });
                if (data?.createColorPalette) {
                  onSave?.({
                    id: Number(data.createColorPalette.id),
                    name: data.createColorPalette.name,
                    tokens: data.createColorPalette.tokens,
                  });
                  setName("");
                  setTokens([{ token: "", color: "#000000" }]);
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
        {tokens.map((tok, idx) => (
          <HStack key={idx}>
            <Input
              placeholder="Token"
              value={tok.token}
              onChange={(e) => handleTokenChange(idx, 'token', e.target.value)}
            />
            <Input
              type="color"
              value={tok.color}
              onChange={(e) => handleTokenChange(idx, 'color', e.target.value)}
              w="40px"
              h="40px"
              p={0}
            />
            <IconButton
              aria-label="Remove color"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() => removeToken(idx)}
            />
          </HStack>
        ))}
        <Button leftIcon={<Plus size={16} />} size="sm" onClick={addToken}>
          Add Token
        </Button>
      </VStack>
    </BaseModal>
  );
}


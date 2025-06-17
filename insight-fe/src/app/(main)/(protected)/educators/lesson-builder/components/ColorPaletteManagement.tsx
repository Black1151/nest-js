"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { GET_COLOR_PALETTES, DELETE_COLOR_PALETTE } from "@/graphql/lesson";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import ColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface ColorPaletteManagementProps {
  themeId: number | null;
  onSelectPalette?: (id: number | null) => void;
}

export default function ColorPaletteManagement({
  themeId,
  onSelectPalette,
}: ColorPaletteManagementProps) {
  const { data, refetch } = useQuery(GET_COLOR_PALETTES, {
    variables: { themeId: String(themeId) },
    skip: themeId === null,
    fetchPolicy: "network-only",
  });
  const [deletePalette, { loading: deleting }] =
    useMutation(DELETE_COLOR_PALETTE);

  const [palettes, setPalettes] = useState<
    { id: number; name: string; colors: string[] }[]
  >([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    onSelectPalette?.(selectedId === "" ? null : selectedId);
  }, [selectedId, onSelectPalette]);

  useEffect(() => {
    if (data?.getAllColorPalette) {
      setPalettes(
        data.getAllColorPalette.map((p: any) => ({
          id: Number(p.id),
          name: p.name,
          colors: p.colors,
        }))
      );
    } else {
      setPalettes([]);
    }
  }, [data]);

  // Clear selected palette when theme changes
  useEffect(() => {
    setSelectedId("");
  }, [themeId]);

  const selected = palettes.find((p) => p.id === selectedId);
  const options = palettes.map((p) => ({ label: p.name, value: String(p.id) }));
  const isDisabled = themeId === null;

  return (
    <Flex flex={1} p={4} w="100%" direction="column" align="start">
      <Text fontSize="sm" mb={2}>Color Palettes</Text>
      <CrudDropdown
        options={options}
        value={selectedId}
        onChange={(e) =>
          setSelectedId(
            e.target.value === "" ? "" : parseInt(e.target.value, 10)
          )
        }
        onCreate={() => setIsAddOpen(true)}
        onUpdate={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={selectedId === ""}
        isDeleteDisabled={selectedId === ""}
        isDisabled={isDisabled}
      />

      <ColorPaletteModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        themeId={themeId === null ? 0 : (themeId as number)}
        onSave={async (palette) => {
          setPalettes((ps) => [...ps, palette]);
          refetch();
        }}
      />

      <ColorPaletteModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        themeId={themeId === null ? 0 : (themeId as number)}
        paletteId={selectedId === "" ? undefined : selectedId}
        initialName={selected?.name ?? ""}
        initialColors={selected?.colors ?? []}
        title="Update Color Palette"
        confirmLabel="Update"
        onSave={async (palette) => {
          setPalettes((ps) =>
            ps.map((p) => (p.id === palette.id ? palette : p))
          );
          refetch();
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete palette"
        bodyText="Are you sure you want to delete this palette?"
        onConfirm={async () => {
          if (selectedId === "") return;
          await deletePalette({ variables: { data: { id: selectedId } } });
          setPalettes((ps) => ps.filter((p) => p.id !== selectedId));
          setSelectedId("");
          setIsDeleteOpen(false);
          refetch();
        }}
        isLoading={deleting}
      />
    </Flex>
  );
}

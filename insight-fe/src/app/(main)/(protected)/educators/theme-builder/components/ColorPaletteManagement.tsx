"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { GET_COLOR_PALETTES, DELETE_COLOR_PALETTE } from "@/graphql/lesson";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import ColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface ColorPaletteManagementProps {
  collectionId: number | null;
  onSelectPalette?: (id: number | null) => void;
  selectedId?: number | null;
}

export default function ColorPaletteManagement({
  collectionId,
  onSelectPalette,
  selectedId,
}: ColorPaletteManagementProps) {
  const { data, refetch } = useQuery(GET_COLOR_PALETTES, {
    variables: { collectionId: collectionId === null ? null : String(collectionId) },
    fetchPolicy: "network-only",
  });
  const [deletePalette, { loading: deleting }] =
    useMutation(DELETE_COLOR_PALETTE);

  const [palettes, setPalettes] = useState<
    { id: number; name: string; colors: string[] }[]
  >([]);
  const [selectedState, setSelectedState] = useState<number | "">("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (selectedId !== undefined) {
      setSelectedState(selectedId === null ? "" : selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    onSelectPalette?.(selectedState === "" ? null : selectedState);
  }, [selectedState, onSelectPalette]);

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

  // Clear selected palette when collection changes unless externally provided
  useEffect(() => {
    if (selectedId === undefined) {
      setSelectedState("");
    }
  }, [collectionId, selectedId]);

  const selected = palettes.find((p) => p.id === selectedState);
  const options = palettes.map((p) => ({ label: p.name, value: String(p.id) }));
  const isDisabled = false;

  return (
    <Flex flex={1} p={4} w="100%" direction="column" align="start">
      <Text fontSize="sm" mb={2}>Color Palettes</Text>
      <CrudDropdown
        options={options}
        value={selectedState}
        onChange={(e) =>
          setSelectedState(
            e.target.value === "" ? "" : parseInt(e.target.value, 10)
          )
        }
        onCreate={() => setIsAddOpen(true)}
        onUpdate={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={selectedState === ""}
        isDeleteDisabled={selectedState === ""}
        isDisabled={isDisabled}
      />

      <ColorPaletteModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        collectionId={collectionId === null ? 0 : (collectionId as number)}
        onSave={async (palette) => {
          setPalettes((ps) => [...ps, palette]);
          refetch();
        }}
      />

      <ColorPaletteModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        collectionId={collectionId === null ? 0 : (collectionId as number)}
        paletteId={selectedState === "" ? undefined : selectedState}
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
          if (selectedState === "") return;
          await deletePalette({ variables: { data: { id: selectedState } } });
          setPalettes((ps) => ps.filter((p) => p.id !== selectedState));
          setSelectedState("");
          setIsDeleteOpen(false);
          refetch();
        }}
        isLoading={deleting}
      />
    </Flex>
  );
}

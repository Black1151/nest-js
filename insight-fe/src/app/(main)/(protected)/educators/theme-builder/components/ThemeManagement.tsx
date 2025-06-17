"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  GET_ALL_THEMES,
  CREATE_THEME,
  UPDATE_THEME,
  DELETE_THEME,
} from "@/graphql/lesson";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import AddThemeModal from "@/components/lesson/modals/AddThemeModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

interface ThemeManagementProps {
  onSelectTheme?: (id: number | null) => void;
  selectedId?: number | null;
}

export default function ThemeManagement({
  onSelectTheme,
  selectedId,
}: ThemeManagementProps) {
  const { data, refetch } = useQuery(GET_ALL_THEMES, {
    fetchPolicy: "network-only",
  });
  const [createTheme] = useMutation(CREATE_THEME);
  const [updateTheme] = useMutation(UPDATE_THEME);
  const [deleteTheme, { loading: deleting }] = useMutation(DELETE_THEME);

  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
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
    onSelectTheme?.(selectedState === "" ? null : selectedState);
  }, [selectedState, onSelectTheme]);

  useEffect(() => {
    if (data?.getAllTheme) {
      setThemes(
        data.getAllTheme.map((t: any) => ({ id: Number(t.id), name: t.name }))
      );
    } else {
      setThemes([]);
    }
  }, [data]);

  const selected = themes.find((t) => t.id === selectedState);
  const options = themes.map((t) => ({ label: t.name, value: String(t.id) }));

  return (
    <Flex flex={1} p={4} w="100%" direction="column" align="start">
      <Text fontSize="sm" mb={2}>
        Themes
      </Text>
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
      />

      <AddThemeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={async (name) => {
          const { data: res } = await createTheme({ variables: { data: { name } } });
          const created = res?.createTheme;
          if (created) {
            const theme = { id: Number(created.id), name: created.name };
            setThemes((ts) => [...ts, theme]);
            setSelectedState(theme.id);
            refetch();
          }
        }}
      />

      <AddThemeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Theme"
        confirmLabel="Update"
        initialName={selected?.name ?? ""}
        onSave={async (name) => {
          if (selectedState === "") return;
          const { data: res } = await updateTheme({
            variables: { data: { id: selectedState, name } },
          });
          const updated = res?.updateTheme;
          if (updated) {
            setThemes((ts) =>
              ts.map((t) =>
                t.id === selectedState ? { id: t.id, name: updated.name } : t
              )
            );
            refetch();
          }
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete theme"
        bodyText="Are you sure you want to delete this theme?"
        onConfirm={async () => {
          if (selectedState === "") return;
          await deleteTheme({ variables: { data: { id: selectedState } } });
          setThemes((ts) => ts.filter((t) => t.id !== selectedState));
          setSelectedState("");
          setIsDeleteOpen(false);
          refetch();
        }}
        isLoading={deleting}
      />
    </Flex>
  );
}

"use client";
import { Flex, HStack, VStack, Button, Heading } from "@chakra-ui/react";
import StyleCollectionManagement from "./components/StyleCollectionManagement";
import { useState, useEffect } from "react";
import ColorPaletteManagement from "./components/ColorPaletteManagement";
import StyleGroupManagement from "./components/StyleGroupManagement";
import { AvailableElements } from "./components/AvailableElements";
import StyledElementsPalette from "./components/StyledElementsPalette";
import BaseElementsPalette from "./components/BaseElementsPalette";
import ThemeCanvas from "./components/ThemeCanvas";
import SaveThemeModal from "./components/SaveThemeModal";
import LoadThemeModal, { ThemeInfo } from "./components/LoadThemeModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_THEMES, CREATE_THEME, UPDATE_THEME } from "@/graphql/lesson";

export const ThemeBuilderPageClient = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(
    null
  );
  const [isSaveThemeOpen, setIsSaveThemeOpen] = useState(false);
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const [isLoadThemeOpen, setIsLoadThemeOpen] = useState(false);
  const [themes, setThemes] = useState<ThemeInfo[]>([]);
  const [loadedTheme, setLoadedTheme] = useState<ThemeInfo | null>(null);

  const { data: themesData } = useQuery(GET_ALL_THEMES);
  const [createTheme] = useMutation(CREATE_THEME);
  const [updateTheme] = useMutation(UPDATE_THEME);

  useEffect(() => {
    if (themesData?.getAllTheme) {
      setThemes(
        themesData.getAllTheme.map((t: any) => ({
          id: Number(t.id),
          name: t.name,
          styleCollectionId: t.styleCollectionId,
          defaultPaletteId: t.defaultPaletteId,
        }))
      );
    }
  }, [themesData]);

  const handleSaveTheme = async (name: string) => {
    if (selectedCollectionId === null || selectedPaletteId === null) return;
    if (loadedTheme) {
      const { data } = await updateTheme({
        variables: {
          data: {
            id: loadedTheme.id,
            name,
            styleCollectionId: selectedCollectionId,
            defaultPaletteId: selectedPaletteId,
          },
        },
      });
      const updated = data?.updateTheme;
      if (updated) {
        const theme = {
          id: Number(updated.id),
          name: updated.name,
          styleCollectionId: updated.styleCollectionId,
          defaultPaletteId: updated.defaultPaletteId,
        };
        setThemes((ts) => ts.map((t) => (t.id === theme.id ? theme : t)));
        setLoadedTheme(theme);
      }
    } else {
      const { data } = await createTheme({
        variables: {
          data: {
            name,
            styleCollectionId: selectedCollectionId,
            defaultPaletteId: selectedPaletteId,
          },
        },
      });
      const created = data?.createTheme;
      if (created) {
        const theme = {
          id: Number(created.id),
          name: created.name,
          styleCollectionId: created.styleCollectionId,
          defaultPaletteId: created.defaultPaletteId,
        };
        setThemes((ts) => [...ts, theme]);
        setLoadedTheme(theme);
      }
    }
  };

  const handleLoadTheme = (theme: ThemeInfo) => {
    setSelectedCollectionId(theme.styleCollectionId);
    setSelectedPaletteId(theme.defaultPaletteId);
    setLoadedTheme(theme);
  };

  return (
    <VStack w="100%">
      <Heading size="md" data-testid="theme-name">
        {loadedTheme ? loadedTheme.name : "New Theme"}
      </Heading>
      <HStack flex={1} w="100%" align="start">
        <StyleCollectionManagement
          onSelectCollection={setSelectedCollectionId}
          selectedId={selectedCollectionId}
        />
        <ColorPaletteManagement
          collectionId={selectedCollectionId}
          onSelectPalette={setSelectedPaletteId}
          selectedId={selectedPaletteId}
        />
      </HStack>
      <HStack w="100%">
        <AvailableElements
          selectedType={selectedElementType}
          onSelect={setSelectedElementType}
        />
        <StyleGroupManagement
          collectionId={selectedCollectionId}
          elementType={selectedElementType}
          onSelectGroup={setSelectedGroupId}
        />
      </HStack>
      <HStack w="100%" align="start" pt={4} spacing={4}>
        <Flex flex={1} width="50%" bg="blue.100" p={4}>
          <BaseElementsPalette />
        </Flex>
        <Flex flex={1} width="50%" bg="green.100" p={4}>
          <StyledElementsPalette
            collectionId={selectedCollectionId}
            elementType={selectedElementType}
            groupId={selectedGroupId}
          />
        </Flex>
      </HStack>
      <HStack w="100%" justify="flex-end" pt={2}>
        <Button onClick={() => setIsLoadThemeOpen(true)}>Load Theme</Button>
        <Button
          colorScheme="blue"
          onClick={() =>
            loadedTheme ? setIsConfirmUpdateOpen(true) : setIsSaveThemeOpen(true)
          }
        >
          Save Theme
        </Button>
      </HStack>
      <ThemeCanvas
        collectionId={selectedCollectionId}
        paletteId={selectedPaletteId}
      />
      <SaveThemeModal
        isOpen={isSaveThemeOpen}
        onClose={() => setIsSaveThemeOpen(false)}
        onSave={(name) => {
          handleSaveTheme(name);
          setIsSaveThemeOpen(false);
        }}
      />
      <ConfirmationModal
        isOpen={isConfirmUpdateOpen}
        onClose={() => setIsConfirmUpdateOpen(false)}
        action="update theme"
        bodyText="Are you sure you want to update this theme?"
        onConfirm={() => {
          if (loadedTheme) {
            handleSaveTheme(loadedTheme.name);
          }
          setIsConfirmUpdateOpen(false);
        }}
      />
      <LoadThemeModal
        isOpen={isLoadThemeOpen}
        onClose={() => setIsLoadThemeOpen(false)}
        themes={themes}
        onLoad={(theme) => {
          handleLoadTheme(theme);
          setIsLoadThemeOpen(false);
        }}
      />
    </VStack>
  );
};

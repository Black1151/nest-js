"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  HStack,
  Text,
  Accordion,
} from "@chakra-ui/react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  GET_COLOR_PALETTES,
  CREATE_THEME,
  CREATE_STYLE_COLLECTION,
  UPDATE_STYLE_COLLECTION,
  DELETE_STYLE_COLLECTION,
  CREATE_COLOR_PALETTE,
  UPDATE_COLOR_PALETTE,
  DELETE_COLOR_PALETTE,
  GET_STYLE_GROUPS,
  CREATE_STYLE_GROUP,
  UPDATE_STYLE_GROUP,
  DELETE_STYLE_GROUP,
} from "@/graphql/lesson";
import SaveStyleModal from "@/components/lesson/modals/SaveStyleModal";
import AddStyleCollectionModal from "@/components/lesson/modals/AddStyleCollectionModal";
import AddColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import AddStyleGroupModal from "@/components/lesson/modals/AddStyleGroupModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { availableFonts } from "@/theme/fonts";
import WrapperSettings from "@/components/lesson/attributes/WrapperSettings";
import TextAttributes from "@/components/lesson/attributes/TextAttributes";
import useStyleAttributes from "@/components/lesson/hooks/useStyleAttributes";
import ElementWrapper from "@/components/lesson/elements/ElementWrapper";

const DEFAULT_ELEMENT = "Text";

export default function ThemeBuilderPageClient() {
  const [themeName, setThemeName] = useState("");
  const [styleCollections, setStyleCollections] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "">(
    "",
  );
  const [colorPalettes, setColorPalettes] = useState<
    {
      id: number;
      name: string;
      colors: string[];
    }[]
  >([]);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | "">("");
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [isAddPaletteOpen, setIsAddPaletteOpen] = useState(false);
  const [isEditPaletteOpen, setIsEditPaletteOpen] = useState(false);
  const [isDeletePaletteOpen, setIsDeletePaletteOpen] = useState(false);
  const [styleGroups, setStyleGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);

  const collectionOptions = useMemo(
    () => styleCollections.map((c) => ({ label: c.name, value: String(c.id) })),
    [styleCollections],
  );

  const paletteOptions = useMemo(
    () => colorPalettes.map((p) => ({ label: p.name, value: String(p.id) })),
    [colorPalettes],
  );
  const groupOptions = useMemo(
    () => styleGroups.map((g) => ({ label: g.name, value: String(g.id) })),
    [styleGroups],
  );

  const selectedCollection = useMemo(
    () =>
      selectedCollectionId === ""
        ? undefined
        : styleCollections.find((c) => c.id === selectedCollectionId),
    [styleCollections, selectedCollectionId],
  );
  const selectedGroup = useMemo(
    () =>
      selectedGroupId === ""
        ? undefined
        : styleGroups.find((g) => g.id === selectedGroupId),
    [styleGroups, selectedGroupId],
  );

  const selectedPalette = useMemo(
    () =>
      selectedPaletteId === ""
        ? undefined
        : colorPalettes.find((p) => p.id === selectedPaletteId),
    [colorPalettes, selectedPaletteId],
  );

  const wrapperAttrs = useStyleAttributes({ deps: [] });

  const [text, setText] = useState("Sample Text");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState(availableFonts[0].fontFamily);
  const [fontWeight, setFontWeight] = useState("normal");
  const [lineHeight, setLineHeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");

  const { data: collectionsData, refetch: refetchCollections } = useQuery(
    GET_STYLE_COLLECTIONS,
  );
  const [fetchPalettes, { data: palettesData }] =
    useLazyQuery(GET_COLOR_PALETTES);
  const [fetchGroups, { data: groupsData }] = useLazyQuery(GET_STYLE_GROUPS);
  const [createTheme, { loading: saving }] = useMutation(CREATE_THEME, {
    onCompleted: () => {
      setThemeName("");
    },
  });
  const [createCollection] = useMutation(CREATE_STYLE_COLLECTION);
  const [updateCollection] = useMutation(UPDATE_STYLE_COLLECTION);
  const [deleteCollection, { loading: deletingCollection }] = useMutation(
    DELETE_STYLE_COLLECTION,
  );
  const [createPalette] = useMutation(CREATE_COLOR_PALETTE);
  const [updatePalette] = useMutation(UPDATE_COLOR_PALETTE);
  const [deletePalette, { loading: deletingPalette }] = useMutation(
    DELETE_COLOR_PALETTE,
  );
  const [createGroup] = useMutation(CREATE_STYLE_GROUP);
  const [updateGroup] = useMutation(UPDATE_STYLE_GROUP);
  const [deleteGroup, { loading: deletingGroup }] = useMutation(
    DELETE_STYLE_GROUP,
  );

  useEffect(() => {
    if (collectionsData?.getAllStyleCollection) {
      setStyleCollections(collectionsData.getAllStyleCollection);
    }
  }, [collectionsData]);

  useEffect(() => {
    if (selectedCollectionId !== "") {
      fetchPalettes({
        variables: { collectionId: String(selectedCollectionId) },
      });
      fetchGroups({
        variables: {
          collectionId: String(selectedCollectionId),
          element: DEFAULT_ELEMENT,
        },
      });
    } else {
      setColorPalettes([]);
      setSelectedPaletteId("");
      setStyleGroups([]);
      setSelectedGroupId("");
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (palettesData?.getAllColorPalette) {
      setColorPalettes(palettesData.getAllColorPalette);
    }
  }, [palettesData]);

  useEffect(() => {
    if (groupsData?.getAllStyleGroup) {
      setStyleGroups(groupsData.getAllStyleGroup);
    }
  }, [groupsData]);

  const previewStyles = {
    bgColor: wrapperAttrs.bgColor,
    bgOpacity: wrapperAttrs.bgOpacity,
    gradientFrom: wrapperAttrs.gradientFrom,
    gradientTo: wrapperAttrs.gradientTo,
    gradientDirection: wrapperAttrs.gradientDirection,
    dropShadow: wrapperAttrs.shadow,
    paddingX: wrapperAttrs.paddingX,
    paddingY: wrapperAttrs.paddingY,
    marginX: wrapperAttrs.marginX,
    marginY: wrapperAttrs.marginY,
    borderColor: wrapperAttrs.borderColor,
    borderWidth: wrapperAttrs.borderWidth,
    borderRadius: wrapperAttrs.borderRadius,
  };

  return (
    <Stack spacing={4}>
      <Heading size="md">Theme Builder</Heading>
      <FormControl>
        <FormLabel>Theme Name</FormLabel>
        <Input
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
        />
      </FormControl>
      <HStack align="start">
        <FormControl flex={1}>
          <FormLabel>Style Collection</FormLabel>
          <CrudDropdown
            options={collectionOptions}
            value={selectedCollectionId}
            onChange={(e) =>
              setSelectedCollectionId(
                e.target.value === "" ? "" : parseInt(e.target.value, 10),
              )
            }
            onCreate={() => setIsAddCollectionOpen(true)}
            onUpdate={() => setIsEditCollectionOpen(true)}
            onDelete={() => setIsDeleteCollectionOpen(true)}
            isUpdateDisabled={selectedCollectionId === ""}
            isDeleteDisabled={selectedCollectionId === ""}
          />
        </FormControl>
        <FormControl flex={1}>
          <FormLabel>Color Palette</FormLabel>
          <CrudDropdown
            options={paletteOptions}
            value={selectedPaletteId}
            onChange={(e) =>
              setSelectedPaletteId(
                e.target.value === "" ? "" : parseInt(e.target.value, 10),
              )
            }
            onCreate={() => setIsAddPaletteOpen(true)}
            onUpdate={() => setIsEditPaletteOpen(true)}
            onDelete={() => setIsDeletePaletteOpen(true)}
            isDisabled={selectedCollectionId === ""}
            isUpdateDisabled={selectedPaletteId === ""}
            isDeleteDisabled={selectedPaletteId === ""}
          />
        </FormControl>
        <FormControl flex={1}>
          <FormLabel>Group</FormLabel>
          <CrudDropdown
            options={groupOptions}
            value={selectedGroupId}
            onChange={(e) =>
              setSelectedGroupId(
                e.target.value === "" ? "" : parseInt(e.target.value, 10),
              )
            }
            onCreate={() => setIsAddGroupOpen(true)}
            onUpdate={() => setIsEditGroupOpen(true)}
            onDelete={() => setIsDeleteGroupOpen(true)}
            isDisabled={selectedCollectionId === ""}
            isCreateDisabled={selectedCollectionId === ""}
            isUpdateDisabled={selectedGroupId === ""}
            isDeleteDisabled={selectedGroupId === ""}
          />
        </FormControl>
      </HStack>

      <Accordion allowMultiple>
        <WrapperSettings
          attrs={wrapperAttrs}
          colorPalettes={colorPalettes}
          selectedPaletteId={selectedPaletteId}
        />
        <TextAttributes
          text={text}
          setText={setText}
          color={color}
          setColor={setColor}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontWeight={fontWeight}
          setFontWeight={setFontWeight}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          textAlign={textAlign}
          setTextAlign={setTextAlign}
          colorPalettes={colorPalettes}
          selectedPaletteId={selectedPaletteId}
        />
      </Accordion>

      <Box>
        <Text mb={2}>Preview</Text>
        <ElementWrapper styles={previewStyles}>
          <Text
            color={color}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            lineHeight={lineHeight}
            textAlign={textAlign as any}
          >
            {text}
          </Text>
        </ElementWrapper>
      </Box>

      <Button
        colorScheme="blue"
        isDisabled={
          !themeName || selectedCollectionId === "" || selectedPaletteId === ""
        }
        isLoading={saving}
        onClick={async () => {
          if (selectedCollectionId === "" || selectedPaletteId === "") return;
          await createTheme({
            variables: {
              data: {
                name: themeName,
                styleCollectionId: Number(selectedCollectionId),
                defaultPaletteId: Number(selectedPaletteId),
              },
            },
          });
        }}
      >
        Save Theme
      </Button>

      {isAddCollectionOpen && (
        <SaveStyleModal
          isOpen={isAddCollectionOpen}
          onClose={() => setIsAddCollectionOpen(false)}
          collections={styleCollections}
          elementType={null as any}
          groups={[]}
          onSave={() => {}}
          onAddCollection={(collection) => {
            setStyleCollections((cols) => [...cols, collection]);
            setSelectedCollectionId(collection.id);
            refetchCollections();
          }}
          onAddGroup={() => {}}
        />
      )}

      {isEditCollectionOpen && selectedCollection && (
        <AddStyleCollectionModal
          isOpen={isEditCollectionOpen}
          onClose={() => setIsEditCollectionOpen(false)}
          title="Update Style Collection"
          confirmLabel="Update"
          initialName={selectedCollection.name}
          onSave={async (name) => {
            const { data } = await updateCollection({
              variables: { data: { id: selectedCollectionId as number, name } },
            });
            if (data?.updateStyleCollection) {
              setStyleCollections((cols) =>
                cols.map((c) =>
                  c.id === selectedCollectionId
                    ? { ...c, name: data.updateStyleCollection.name }
                    : c,
                ),
              );
            }
          }}
        />
      )}

      {isDeleteCollectionOpen && (
        <ConfirmationModal
          isOpen={isDeleteCollectionOpen}
          onClose={() => setIsDeleteCollectionOpen(false)}
          action="delete collection"
          bodyText="Are you sure you want to delete this collection?"
          onConfirm={async () => {
            if (selectedCollectionId === "") return;
            await deleteCollection({
              variables: { data: { id: selectedCollectionId } },
            });
            setStyleCollections((cols) =>
              cols.filter((c) => c.id !== selectedCollectionId),
            );
            setSelectedCollectionId("");
            setColorPalettes([]);
            setSelectedPaletteId("");
            setIsDeleteCollectionOpen(false);
          }}
          isLoading={deletingCollection}
        />
      )}

      {isAddPaletteOpen && selectedCollectionId !== "" && (
        <AddColorPaletteModal
          key="add-palette"
          isOpen={isAddPaletteOpen}
          onClose={() => setIsAddPaletteOpen(false)}
          collectionId={selectedCollectionId as number}
          onSave={(palette) => {
            setColorPalettes((p) => [...p, palette]);
            setSelectedPaletteId(palette.id);
          }}
        />
      )}

      {isEditPaletteOpen && (
        <AddColorPaletteModal
          key={`edit-palette-${selectedPaletteId}`}
          isOpen={isEditPaletteOpen}
          onClose={() => setIsEditPaletteOpen(false)}
          collectionId={selectedCollectionId as number}
          paletteId={
            selectedPaletteId === "" ? undefined : (selectedPaletteId as number)
          }
          initialName={selectedPalette?.name ?? ""}
          initialColors={selectedPalette?.colors ?? []}
          title="Update Color Palette"
          confirmLabel="Update"
          onSave={(palette) => {
            setColorPalettes((p) =>
              p.map((col) => (col.id === palette.id ? palette : col)),
            );
          }}
        />
      )}

      {isDeletePaletteOpen && (
        <ConfirmationModal
          isOpen={isDeletePaletteOpen}
          onClose={() => setIsDeletePaletteOpen(false)}
          action="delete palette"
          bodyText="Are you sure you want to delete this palette?"
          onConfirm={async () => {
            if (selectedPaletteId === "") return;
            await deletePalette({ variables: { data: { id: selectedPaletteId } } });
            setColorPalettes((p) =>
              p.filter((col) => col.id !== selectedPaletteId),
            );
            setSelectedPaletteId("");
            setIsDeletePaletteOpen(false);
          }}
          isLoading={deletingPalette}
        />
      )}

      {isAddGroupOpen && (
        <AddStyleGroupModal
          isOpen={isAddGroupOpen}
          onClose={() => setIsAddGroupOpen(false)}
          onSave={async (name) => {
            if (selectedCollectionId === "") return;
            const { data } = await createGroup({
              variables: {
                data: {
                  name,
                  collectionId: selectedCollectionId,
                  element: DEFAULT_ELEMENT,
                },
              },
            });
            if (data?.createStyleGroup) {
              setStyleGroups((gs) => [
                ...gs,
                { id: Number(data.createStyleGroup.id), name: data.createStyleGroup.name },
              ]);
              setSelectedGroupId(Number(data.createStyleGroup.id));
            }
          }}
        />
      )}

      {isEditGroupOpen && selectedGroup && (
        <AddStyleGroupModal
          isOpen={isEditGroupOpen}
          onClose={() => setIsEditGroupOpen(false)}
          title="Update Style Group"
          confirmLabel="Update"
          initialName={selectedGroup.name}
          onSave={async (name) => {
            if (selectedGroupId === "" || selectedCollectionId === "") return;
            const { data } = await updateGroup({
              variables: {
                data: {
                  id: selectedGroupId,
                  name,
                  collectionId: selectedCollectionId,
                  element: DEFAULT_ELEMENT,
                },
              },
            });
            if (data?.updateStyleGroup) {
              setStyleGroups((gs) =>
                gs.map((g) =>
                  g.id === selectedGroupId
                    ? { id: selectedGroupId as number, name: data.updateStyleGroup.name }
                    : g,
                ),
              );
            }
          }}
        />
      )}

      {isDeleteGroupOpen && (
        <ConfirmationModal
          isOpen={isDeleteGroupOpen}
          onClose={() => setIsDeleteGroupOpen(false)}
          action="delete group"
          bodyText="Are you sure you want to delete this group?"
          onConfirm={async () => {
            if (selectedGroupId === "") return;
            await deleteGroup({ variables: { data: { id: selectedGroupId } } });
            setStyleGroups((gs) => gs.filter((g) => g.id !== selectedGroupId));
            setSelectedGroupId("");
            setIsDeleteGroupOpen(false);
          }}
          isLoading={deletingGroup}
        />
      )}
    </Stack>
  );
}

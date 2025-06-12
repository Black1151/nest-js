"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  IconButton,
  Stack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  GET_COLOR_PALETTES,
  GET_STYLE_GROUPS,
  CREATE_STYLE,
  CREATE_THEME,
  CREATE_STYLE_COLLECTION,
  UPDATE_STYLE_COLLECTION,
  DELETE_STYLE_COLLECTION,
  CREATE_COLOR_PALETTE,
  UPDATE_COLOR_PALETTE,
  DELETE_COLOR_PALETTE,
  CREATE_STYLE_GROUP,
  UPDATE_STYLE_GROUP,
  DELETE_STYLE_GROUP,
  CREATE_COMPONENT_VARIANT,
} from "@/graphql/lesson";
import { PageElementType } from "@/__generated__/schema-types";
import SaveStyleModal from "@/components/lesson/modals/SaveStyleModal";
import AddStyleCollectionModal from "@/components/lesson/modals/AddStyleCollectionModal";
import AddColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import AddStyleGroupModal from "@/components/lesson/modals/AddStyleGroupModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { Plus, Trash2 } from "lucide-react";
import ThemeCanvas from "@/components/theme/ThemeCanvas";

const ELEMENT_TYPE_TO_ENUM: Record<string, PageElementType> = {
  text: PageElementType.Text,
  table: PageElementType.Table,
  image: PageElementType.Image,
  video: PageElementType.Video,
};

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
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [isAddPaletteOpen, setIsAddPaletteOpen] = useState(false);
  const [isEditPaletteOpen, setIsEditPaletteOpen] = useState(false);
  const [isDeletePaletteOpen, setIsDeletePaletteOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);

  const [styleGroups, setStyleGroups] = useState<{
    id: number;
    name: string;
  }[]>([]);

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

  const selectedPalette = useMemo(
    () =>
      selectedPaletteId === ""
        ? undefined
        : colorPalettes.find((p) => p.id === selectedPaletteId),
    [colorPalettes, selectedPaletteId],
  );

  const selectedGroup = useMemo(
    () =>
      selectedGroupId === ""
        ? undefined
        : styleGroups.find((g) => g.id === selectedGroupId),
    [styleGroups, selectedGroupId],
  );

  const [selectedElementType, setSelectedElementType] = useState<string>("text");

  const [foundationColors, setFoundationColors] = useState<
    { name: string; value: string }[]
  >([{ name: "primary", value: "#000000" }]);
  const [semanticColors, setSemanticColors] = useState<
    { name: string; ref: string }[]
  >([]);
  const [variants, setVariants] = useState<
    { name: string; base: string; accessible: string; props: string }[]
  >([]);

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
  const [createStyle] = useMutation(CREATE_STYLE);
  const [createVariant] = useMutation(CREATE_COMPONENT_VARIANT);

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
    } else {
      setColorPalettes([]);
      setSelectedPaletteId("");
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    if (palettesData?.getAllColorPalette) {
      setColorPalettes(palettesData.getAllColorPalette);
    }
  }, [palettesData]);

  useEffect(() => {
    if (selectedCollectionId !== "" && selectedElementType) {
      fetchGroups({
        variables: {
          collectionId: String(selectedCollectionId),
          element: selectedElementType,
        },
      });
    } else {
      setStyleGroups([]);
      setSelectedGroupId("");
    }
  }, [selectedCollectionId, selectedElementType]);

  useEffect(() => {
    if (groupsData?.getAllStyleGroup) {
      setStyleGroups(groupsData.getAllStyleGroup);
    }
  }, [groupsData]);

  useEffect(() => {
    if (!styleGroups.find((g) => g.id === selectedGroupId)) {
      setSelectedGroupId("");
    }
  }, [styleGroups]);

  const tokens = useMemo(
    () => ({
      foundationTokens: {
        colors: Object.fromEntries(foundationColors.map((c) => [c.name, c.value])),
      },
      semanticTokens: {
        colors: Object.fromEntries(
          semanticColors.map((c) => [c.name, `colors.${c.ref}`]),
        ),
      },
    }),
    [foundationColors, semanticColors],
  );


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
      </HStack>

      <ThemeCanvas
        styleGroups={styleGroups}
        collectionId={
          selectedCollectionId === "" ? undefined : (selectedCollectionId as number)
        }
        paletteOptions={paletteOptions}
        selectedPaletteId={selectedPaletteId}
        onSelectPalette={setSelectedPaletteId}
        onCreatePalette={() => setIsAddPaletteOpen(true)}
        onEditPalette={() => setIsEditPaletteOpen(true)}
        onDeletePalette={() => setIsDeletePaletteOpen(true)}
        groupOptions={groupOptions}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onCreateGroup={() => setIsAddGroupOpen(true)}
        onEditGroup={() => setIsEditGroupOpen(true)}
        onDeleteGroup={() => setIsDeleteGroupOpen(true)}
        onSaveStyle={async ({ name, groupId }) => {
          if (selectedCollectionId === "") return;
          await createStyle({
            variables: {
              data: {
                name,
                collectionId: selectedCollectionId as number,
                groupId: groupId ?? undefined,
                element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
              },
            },
          });
          if (selectedCollectionId !== "" && selectedElementType) {
            fetchGroups({
              variables: {
                collectionId: String(selectedCollectionId),
                element: selectedElementType,
              },
            });
          }
        }}
        onSelectedElementChange={(el) => {
          setSelectedElementType(el?.type ?? "text");
        }}
      />

      <Box>
        <Text fontWeight="bold" mb={2}>
          Foundation Colors
        </Text>
        {foundationColors.map((c, idx) => (
          <HStack key={idx} mb={2} align="center">
            <Input
              placeholder="token name"
              value={c.name}
              onChange={(e) =>
                setFoundationColors((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, name: e.target.value } : it,
                  ),
                )
              }
            />
            <Input
              type="color"
              w="40px"
              h="40px"
              p={0}
              value={c.value}
              onChange={(e) =>
                setFoundationColors((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, value: e.target.value } : it,
                  ),
                )
              }
            />
            <IconButton
              aria-label="remove"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() =>
                setFoundationColors((arr) => arr.filter((_, i) => i !== idx))
              }
            />
          </HStack>
        ))}
        <Button
          leftIcon={<Plus size={16} />}
          size="sm"
          onClick={() =>
            setFoundationColors((arr) => [
              ...arr,
              { name: "", value: "#000000" },
            ])
          }
        >
          Add Color Token
        </Button>
      </Box>

      <Box>
        <Text fontWeight="bold" mt={4} mb={2}>
          Semantic Colors
        </Text>
        {semanticColors.map((c, idx) => (
          <HStack key={idx} mb={2} align="center">
            <Input
              placeholder="semantic name"
              value={c.name}
              onChange={(e) =>
                setSemanticColors((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, name: e.target.value } : it,
                  ),
                )
              }
            />
            <Select
              placeholder="Foundation token"
              value={c.ref}
              onChange={(e) =>
                setSemanticColors((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, ref: e.target.value } : it,
                  ),
                )
              }
            >
              {foundationColors.map((fc) => (
                <option key={fc.name} value={fc.name}>
                  {fc.name}
                </option>
              ))}
            </Select>
            <IconButton
              aria-label="remove"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() =>
                setSemanticColors((arr) => arr.filter((_, i) => i !== idx))
              }
            />
          </HStack>
        ))}
        <Button
          leftIcon={<Plus size={16} />}
          size="sm"
          onClick={() =>
            setSemanticColors((arr) => [
              ...arr,
              { name: "", ref: foundationColors[0]?.name || "" },
            ])
          }
        >
          Add Semantic Token
        </Button>
      </Box>

      <Box>
        <Text fontWeight="bold" mt={4} mb={2}>
          Component Variants
        </Text>
        {variants.map((v, idx) => (
          <Box key={idx} borderWidth="1px" borderRadius="md" p={2} mb={2}>
            <HStack mb={2}>
              <Input
                placeholder="Variant name"
                value={v.name}
                onChange={(e) =>
                  setVariants((arr) =>
                    arr.map((it, i) =>
                      i === idx ? { ...it, name: e.target.value } : it,
                    ),
                  )
                }
              />
              <Input
                placeholder="Base component"
                value={v.base}
                onChange={(e) =>
                  setVariants((arr) =>
                    arr.map((it, i) =>
                      i === idx ? { ...it, base: e.target.value } : it,
                    ),
                  )
                }
              />
            </HStack>
            <Input
              mb={2}
              placeholder="Accessible name"
              value={v.accessible}
              onChange={(e) =>
                setVariants((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, accessible: e.target.value } : it,
                  ),
                )
              }
            />
            <Textarea
              mb={2}
              placeholder="Props JSON"
              value={v.props}
              onChange={(e) =>
                setVariants((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, props: e.target.value } : it,
                  ),
                )
              }
            />
            <IconButton
              aria-label="remove"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() => setVariants((arr) => arr.filter((_, i) => i !== idx))}
            />
          </Box>
        ))}
        <Button
          leftIcon={<Plus size={16} />}
          size="sm"
          onClick={() =>
            setVariants((arr) => [
              ...arr,
              { name: "", base: "", accessible: "", props: "{}" },
            ])
          }
        >
          Add Variant
        </Button>
      </Box>


      <Button
        colorScheme="blue"
        isDisabled={
          !themeName || selectedCollectionId === "" || selectedPaletteId === ""
        }
        isLoading={saving}
        onClick={async () => {
          if (selectedCollectionId === "" || selectedPaletteId === "") return;
          const fTokens: Record<string, any> = { colors: {} };
          foundationColors.forEach((c) => {
            if (c.name) (fTokens.colors as any)[c.name] = c.value;
          });
          const sTokens: Record<string, any> = { colors: {} };
          semanticColors.forEach((c) => {
            if (c.name && c.ref)
              (sTokens.colors as any)[c.name] = `colors.${c.ref}`;
          });
          const { data } = await createTheme({
            variables: {
              data: {
                name: themeName,
                styleCollectionId: Number(selectedCollectionId),
                defaultPaletteId: Number(selectedPaletteId),
                foundationTokens: fTokens,
                semanticTokens: sTokens,
              },
            },
          });
          const themeId = data?.createTheme.id;
          if (themeId) {
            for (const v of variants) {
              try {
                await createVariant({
                  variables: {
                    data: {
                      name: v.name,
                      baseComponent: v.base,
                      props: JSON.parse(v.props || "{}"),
                      accessibleName: v.accessible,
                      themeId: Number(themeId),
                    },
                  },
                });
              } catch (e) {
                console.error(e);
              }
            }
          }
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

      {isAddGroupOpen && selectedCollectionId !== "" && (
        <AddStyleGroupModal
          key="add-group"
          isOpen={isAddGroupOpen}
          onClose={() => setIsAddGroupOpen(false)}
          onSave={async (name) => {
            if (selectedCollectionId === "" || !selectedElementType) return;
            const { data } = await createGroup({
              variables: {
                data: {
                  name,
                  collectionId: selectedCollectionId as number,
                  element: selectedElementType,
                },
              },
            });
            if (data?.createStyleGroup) {
              setStyleGroups((g) => [...g, data.createStyleGroup]);
              setSelectedGroupId(data.createStyleGroup.id);
            }
          }}
        />
      )}

      {isEditGroupOpen && selectedGroupId !== "" && (
        <AddStyleGroupModal
          key={`edit-group-${selectedGroupId}`}
          isOpen={isEditGroupOpen}
          onClose={() => setIsEditGroupOpen(false)}
          initialName={selectedGroup?.name ?? ""}
          title="Update Style Group"
          confirmLabel="Update"
          onSave={async (name) => {
            if (selectedGroupId === "") return;
            const { data } = await updateGroup({
              variables: { data: { id: selectedGroupId as number, name } },
            });
            if (data?.updateStyleGroup) {
              setStyleGroups((g) =>
                g.map((grp) =>
                  grp.id === selectedGroupId
                    ? { ...grp, name: data.updateStyleGroup.name }
                    : grp,
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
            setStyleGroups((g) => g.filter((grp) => grp.id !== selectedGroupId));
            setSelectedGroupId("");
            setIsDeleteGroupOpen(false);
          }}
          isLoading={deletingGroup}
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

    </Stack>
  );
}

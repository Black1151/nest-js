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
  Accordion,
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
  CREATE_COMPONENT_VARIANT,
} from "@/graphql/lesson";
import { PageElementType } from "@/__generated__/schema-types";
import SaveStyleModal from "@/components/lesson/modals/SaveStyleModal";
import AddStyleCollectionModal from "@/components/lesson/modals/AddStyleCollectionModal";
import AddColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { availableFonts } from "@/theme/fonts";
import WrapperSettings from "@/components/lesson/attributes/WrapperSettings";
import TextAttributes from "@/components/lesson/attributes/TextAttributes";
import ImageAttributes from "@/components/lesson/attributes/ImageAttributes";
import VideoAttributes from "@/components/lesson/attributes/VideoAttributes";
import TableAttributes from "@/components/lesson/attributes/TableAttributes";
import useStyleAttributes from "@/components/lesson/hooks/useStyleAttributes";
import SlideElementRenderer from "@/components/lesson/slide/SlideElementRenderer";
import { Plus, Trash2 } from "lucide-react";

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
];

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
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [isAddPaletteOpen, setIsAddPaletteOpen] = useState(false);
  const [isEditPaletteOpen, setIsEditPaletteOpen] = useState(false);
  const [isDeletePaletteOpen, setIsDeletePaletteOpen] = useState(false);

  const collectionOptions = useMemo(
    () => styleCollections.map((c) => ({ label: c.name, value: String(c.id) })),
    [styleCollections],
  );

  const paletteOptions = useMemo(
    () => colorPalettes.map((p) => ({ label: p.name, value: String(p.id) })),
    [colorPalettes],
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

  const wrapperAttrs = useStyleAttributes({ deps: [] });

  const [selectedElementType, setSelectedElementType] = useState<string>("text");

  const [text, setText] = useState("Sample Text");
  const [colorToken, setColorToken] = useState("primary");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState(availableFonts[0].fontFamily);
  const [fontWeight, setFontWeight] = useState("normal");
  const [lineHeight, setLineHeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");
  const [src, setSrc] = useState("");
  const [url, setUrl] = useState("");
  const [table, setTable] = useState({
    rows: 2,
    cols: 2,
    cells: Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => ({ text: "", styleOverrides: { colorToken: "" } }))
    ),
  });

  const [foundationColors, setFoundationColors] = useState<
    { name: string; value: string }[]
  >([{ name: "primary", value: "#000000" }]);
  const [semanticColors, setSemanticColors] = useState<
    { name: string; ref: string }[]
  >([]);
  const [variants, setVariants] = useState<
    { name: string; base: string; accessible: string; props: string }[]
  >([]);
  const [styleGroups, setStyleGroups] = useState<{
    id: number;
    name: string;
  }[]>([]);
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);

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
    }
  }, [selectedCollectionId, selectedElementType]);

  useEffect(() => {
    if (groupsData?.getAllStyleGroup) {
      setStyleGroups(groupsData.getAllStyleGroup);
    }
  }, [groupsData]);

  const tokens = useMemo(
    () => ({ colors: Object.fromEntries(foundationColors.map((c) => [c.name, c.value])) }),
    [foundationColors],
  );

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

  const previewElement = useMemo(
    () => ({
      id: "preview",
      type: selectedElementType,
      text,
      src,
      url,
      table,
      wrapperStyles: previewStyles,
      styleOverrides: {
        colorToken,
        fontSize,
        fontFamily,
        fontWeight,
        lineHeight,
        textAlign,
      },
    }),
    [
      selectedElementType,
      text,
      src,
      url,
      table,
      previewStyles,
      colorToken,
      fontSize,
      fontFamily,
      fontWeight,
      lineHeight,
      textAlign,
    ],
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

      <HStack>
        {AVAILABLE_ELEMENTS.map((el) => (
          <Button
            key={el.type}
            size="sm"
            variant={selectedElementType === el.type ? "solid" : "outline"}
            onClick={() => setSelectedElementType(el.type)}
          >
            {el.label}
          </Button>
        ))}
      </HStack>

      <Accordion allowMultiple>
        <WrapperSettings attrs={wrapperAttrs} tokens={tokens} />
        {selectedElementType === "text" && (
          <TextAttributes
            text={text}
            setText={setText}
            colorToken={colorToken}
            setColorToken={setColorToken}
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
            tokens={tokens}
          />
        )}
        {selectedElementType === "image" && (
          <ImageAttributes src={src} setSrc={setSrc} />
        )}
        {selectedElementType === "video" && (
          <VideoAttributes url={url} setUrl={setUrl} />
        )}
        {selectedElementType === "table" && (
          <TableAttributes table={table} setTable={setTable} tokens={tokens} />
        )}
      </Accordion>

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

      <Box>
        <Text mb={2}>Preview</Text>
        <SlideElementRenderer item={previewElement as any} tokens={tokens} />
      </Box>

      <Button
        colorScheme="blue"
        isDisabled={selectedCollectionId === ""}
        onClick={() => setIsSaveStyleOpen(true)}
      >
        Save Element Style
      </Button>

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

      {isSaveStyleOpen && (
        <SaveStyleModal
          isOpen={isSaveStyleOpen}
          onClose={() => setIsSaveStyleOpen(false)}
          collectionId={selectedCollectionId as number}
          elementType={selectedElementType}
          groups={styleGroups}
          onAddGroup={(g) => setStyleGroups((arr) => [...arr, g])}
          onSave={async ({ name, groupId }) => {
            if (selectedCollectionId === "") return;
            await createStyle({
              variables: {
                data: {
                  name,
                  collectionId: selectedCollectionId as number,
                  groupId: groupId ?? undefined,
                  element: ELEMENT_TYPE_TO_ENUM[selectedElementType],
                  config: previewElement,
                },
              },
            });
            // refresh groups in case a new one was added
            if (selectedCollectionId !== "" && selectedElementType) {
              fetchGroups({
                variables: {
                  collectionId: String(selectedCollectionId),
                  element: selectedElementType,
                },
              });
            }
          }}
        />
      )}
    </Stack>
  );
}

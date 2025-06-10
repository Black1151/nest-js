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
  Text,
  Accordion,
} from "@chakra-ui/react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  GET_COLOR_PALETTES,
  CREATE_THEME,
} from "@/graphql/lesson";
import SaveStyleModal from "@/components/lesson/modals/SaveStyleModal";
import AddColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";
import { availableFonts } from "@/theme/fonts";
import WrapperSettings from "@/components/lesson/attributes/WrapperSettings";
import TextAttributes from "@/components/lesson/attributes/TextAttributes";
import useStyleAttributes from "@/components/lesson/hooks/useStyleAttributes";
import ElementWrapper from "@/components/lesson/elements/ElementWrapper";

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
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  const collectionOptions = useMemo(
    () => styleCollections.map((c) => ({ label: c.name, value: String(c.id) })),
    [styleCollections],
  );

  const paletteOptions = useMemo(
    () => colorPalettes.map((p) => ({ label: p.name, value: String(p.id) })),
    [colorPalettes],
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
  const [createTheme, { loading: saving }] = useMutation(CREATE_THEME, {
    onCompleted: () => {
      setThemeName("");
    },
  });

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
      <FormControl>
        <FormLabel>Style Collection</FormLabel>
        <CrudDropdown
          options={collectionOptions}
          value={selectedCollectionId}
          onChange={(e) =>
            setSelectedCollectionId(
              e.target.value === "" ? "" : parseInt(e.target.value, 10),
            )
          }
          onCreate={() => setIsCollectionModalOpen(true)}
          onUpdate={() => {}}
          onDelete={() => {}}
          isUpdateDisabled
          isDeleteDisabled
        />
      </FormControl>
      <FormControl isDisabled={selectedCollectionId === ""}>
        <FormLabel>Default Palette</FormLabel>
        <CrudDropdown
          options={paletteOptions}
          value={selectedPaletteId}
          onChange={(e) =>
            setSelectedPaletteId(
              e.target.value === "" ? "" : parseInt(e.target.value, 10),
            )
          }
          onCreate={() => setIsPaletteModalOpen(true)}
          onUpdate={() => {}}
          onDelete={() => {}}
          isDisabled={selectedCollectionId === ""}
          isCreateDisabled={selectedCollectionId === ""}
          isUpdateDisabled
          isDeleteDisabled
        />
      </FormControl>

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

      {isCollectionModalOpen && (
        <SaveStyleModal
          isOpen={isCollectionModalOpen}
          onClose={() => setIsCollectionModalOpen(false)}
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

      {isPaletteModalOpen && selectedCollectionId !== "" && (
        <AddColorPaletteModal
          isOpen={isPaletteModalOpen}
          onClose={() => setIsPaletteModalOpen(false)}
          collectionId={selectedCollectionId as number}
          onSave={(palette) => {
            setColorPalettes((p) => [...p, palette]);
            setSelectedPaletteId(palette.id);
          }}
        />
      )}
    </Stack>
  );
}

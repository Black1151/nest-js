"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_STYLE_COLLECTIONS,
  GET_COLOR_PALETTES,
  CREATE_THEME,
} from "@/graphql/lesson";
import SaveStyleModal from "@/components/lesson/modals/SaveStyleModal";
import AddColorPaletteModal from "@/components/lesson/modals/AddColorPaletteModal";
import { availableFonts } from "@/theme/fonts";
import WrapperSettings from "@/components/lesson/attributes/WrapperSettings";
import TextAttributes from "@/components/lesson/attributes/TextAttributes";
import useStyleAttributes from "@/components/lesson/hooks/useStyleAttributes";
import ElementWrapper from "@/components/lesson/elements/ElementWrapper";

export default function ThemeBuilderPageClient() {
  const [themeName, setThemeName] = useState("");
  const [styleCollections, setStyleCollections] = useState<{
    id: number;
    name: string;
  }[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "">(
    ""
  );
  const [colorPalettes, setColorPalettes] = useState<{
    id: number;
    name: string;
    colors: string[];
  }[]>([]);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | "">("");
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  const wrapperAttrs = useStyleAttributes({ deps: [] });

  const [text, setText] = useState("Sample Text");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState(availableFonts[0].fontFamily);
  const [fontWeight, setFontWeight] = useState("normal");
  const [lineHeight, setLineHeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");

  const { data: collectionsData, refetch: refetchCollections } =
    useQuery(GET_STYLE_COLLECTIONS);
  const [fetchPalettes, { data: palettesData }] = useLazyQuery(GET_COLOR_PALETTES);
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
      fetchPalettes({ variables: { collectionId: String(selectedCollectionId) } });
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
        <Input value={themeName} onChange={(e) => setThemeName(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Style Collection</FormLabel>
        <Select
          placeholder="Select collection"
          value={selectedCollectionId}
          onChange={(e) =>
            setSelectedCollectionId(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
        >
          {styleCollections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={() => setIsCollectionModalOpen(true)} size="sm">
        Add Collection
      </Button>
      <FormControl isDisabled={selectedCollectionId === ""}>
        <FormLabel>Default Palette</FormLabel>
        <Select
          placeholder="Select palette"
          value={selectedPaletteId}
          onChange={(e) =>
            setSelectedPaletteId(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
        >
          {colorPalettes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={() => setIsPaletteModalOpen(true)}
        size="sm"
        isDisabled={selectedCollectionId === ""}
      >
        Add Palette
      </Button>

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


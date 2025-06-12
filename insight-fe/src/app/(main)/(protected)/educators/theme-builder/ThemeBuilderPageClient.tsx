"use client";

import { useState, useEffect } from "react";
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
  GET_STYLE_GROUPS,
  CREATE_THEME,
} from "@/graphql/lesson";
import ThemeToolbar from "@/components/theme/ThemeToolbar";
import ThemeSlideSequencer from "@/components/theme/ThemeSlideSequencer";
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
  const [styleGroups, setStyleGroups] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");


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
          element: "Text",
        },
      });
    } else {
      setColorPalettes([]);
      setSelectedPaletteId("");
      setStyleGroups([]);
    }
    setSelectedGroupId("");
  }, [selectedCollectionId]);

  useEffect(() => {
    if (palettesData?.getAllColorPalette) {
      setColorPalettes(palettesData.getAllColorPalette);
    }
  }, [palettesData]);

  useEffect(() => {
    if (groupsData?.getAllStyleGroup) {
      setStyleGroups(groupsData.getAllStyleGroup);
    } else {
      setStyleGroups([]);
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
      <ThemeToolbar
        styleCollections={styleCollections}
        styleGroups={styleGroups}
        colorPalettes={colorPalettes}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        selectedPaletteId={selectedPaletteId}
        onSelectPalette={setSelectedPaletteId}
        selectedElementType="text"
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onAddCollection={async (collection) => {
          setStyleCollections([...styleCollections, collection]);
          await refetchCollections();
        }}
        onUpdateCollection={async (collection) => {
          setStyleCollections((cols) =>
            cols.map((c) => (c.id === collection.id ? collection : c)),
          );
          await refetchCollections();
        }}
        onDeleteCollection={async (id) => {
          setStyleCollections((cols) => cols.filter((c) => c.id !== id));
          if (selectedCollectionId === id) {
            setSelectedCollectionId("");
            setColorPalettes([]);
            setSelectedPaletteId("");
            setStyleGroups([]);
            setSelectedGroupId("");
          }
          await refetchCollections();
        }}
        onAddGroup={(group) => {
          setStyleGroups((gs) => [...gs, group]);
          setSelectedGroupId(group.id);
        }}
        onUpdateGroup={(group) => {
          setStyleGroups((gs) =>
            gs.map((g) => (g.id === group.id ? group : g)),
          );
        }}
        onDeleteGroup={(id) => {
          setStyleGroups((gs) => gs.filter((g) => g.id !== id));
          if (selectedGroupId === id) setSelectedGroupId("");
        }}
        onAddPalette={(palette) => {
          setColorPalettes((p) => [...p, palette]);
          setSelectedPaletteId(palette.id);
        }}
        onUpdatePalette={(palette) => {
          setColorPalettes((p) =>
            p.map((pl) => (pl.id === palette.id ? palette : pl)),
          );
        }}
        onDeletePalette={(id) => {
          setColorPalettes((p) => p.filter((pl) => pl.id !== id));
          if (selectedPaletteId === id) setSelectedPaletteId("");
        }}
      />

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

    </Stack>
  );
}

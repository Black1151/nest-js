"use client";
import { HStack, VStack } from "@chakra-ui/react";
import StyleCollectionManagement from "./components/StyleCollectionManagement";
import { useState } from "react";
import ColorPaletteManagement from "./components/ColorPaletteManagement";
import StyleGroupManagement from "./components/StyleGroupManagement";
import { AvailableElements } from "./components/AvailableElements";
import StyledElementsPalette from "./components/StyledElementsPalette";
import BaseElementsPalette from "./components/BaseElementsPalette";
import ThemeCanvas from "./components/ThemeCanvas";

export const ThemeBuilderPageClient = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(null);

  return (
    <VStack w="100%">
      <HStack flex={1} w="100%" align="start">
        <StyleCollectionManagement
          onSelectCollection={setSelectedCollectionId}
        />
        <ColorPaletteManagement
          collectionId={selectedCollectionId}
          onSelectPalette={setSelectedPaletteId}
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
        <StyledElementsPalette
          collectionId={selectedCollectionId}
          elementType={selectedElementType}
          groupId={selectedGroupId}
        />
        <BaseElementsPalette />
      </HStack>
      <ThemeCanvas
        collectionId={selectedCollectionId}
        paletteId={selectedPaletteId}
      />
    </VStack>
  );
};

"use client";
import { HStack, VStack } from "@chakra-ui/react";
import StyleCollectionManagement from "./components/StyleCollectionManagement";
import { useState } from "react";
import ColorPaletteManagement from "./components/ColorPaletteManagement";
import StyleGroupManagement from "./components/StyleGroupManagement";
import { AvailableElements } from "./components/AvailableElements";

export const ThemeBuilderPageClient = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );

  return (
    <VStack w="100%">
      <HStack flex={1} w="100%" align="start">
        <StyleCollectionManagement
          onSelectCollection={setSelectedCollectionId}
        />
        <ColorPaletteManagement collectionId={selectedCollectionId} />
      </HStack>
      <HStack w="100%">
        <AvailableElements
          selectedType={selectedElementType}
          onSelect={setSelectedElementType}
        />
        <StyleGroupManagement
          collectionId={selectedCollectionId}
          elementType={selectedElementType}
        />
      </HStack>
    </VStack>
  );
};

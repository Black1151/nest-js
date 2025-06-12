"use client";
import { HStack, VStack, Button } from "@chakra-ui/react";
import StyleCollectionManagement from "./components/StyleCollectionManagement";
import { useState } from "react";
import ColorPaletteManagement from "./components/ColorPaletteManagement";
import { AvailableElements } from "./components/AvailableElements";

export const ThemeBuilderPageClient = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);

  return (
    <VStack w="100%">
      <HStack flex={1} w="100%" align="start">
        <StyleCollectionManagement
          onSelectCollection={setSelectedCollectionId}
        />
        <ColorPaletteManagement collectionId={selectedCollectionId} />
      </HStack>
      <HStack w="100%" p={4}>
        <AvailableElements />
      </HStack>
    </VStack>
  );
};

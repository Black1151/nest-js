"use client";
import { HStack, VStack } from "@chakra-ui/react";
import StyleCollectionManagement from "./components/StyleCollectionManagement";
import { useState } from "react";
import ColorPaletteManagement from "./ColorPaletteManagement";

export const ThemeBuilderPageClient = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);

  return (
    <VStack w="100%">
      <HStack flex={1} w="100%" align="start" p={4}>
        <StyleCollectionManagement
          onSelectCollection={setSelectedCollectionId}
        />
        <ColorPaletteManagement collectionId={selectedCollectionId} />
      </HStack>
    </VStack>
  );
};

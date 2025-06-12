"use client";
import { HStack, VStack, Button } from "@chakra-ui/react";
import StyleCollectionManagement from "./components/StyleCollectionManagement";
import { useState } from "react";
import ColorPaletteManagement from "./ColorPaletteManagement";

export const ThemeBuilderPageClient = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);

  const AVAILABLE_ELEMENTS = [
    { type: "text", label: "Text" },
    { type: "table", label: "Table" },
    { type: "image", label: "Image" },
    { type: "video", label: "Video" },
    { type: "quiz", label: "Quiz" },
  ];

  return (
    <VStack w="100%">
      <HStack flex={1} w="100%" align="start" p={4}>
        <StyleCollectionManagement
          onSelectCollection={setSelectedCollectionId}
        />
        <ColorPaletteManagement collectionId={selectedCollectionId} />
      </HStack>
      <HStack w="100%" p={4}>
        {AVAILABLE_ELEMENTS.map((el) => (
          <Button key={el.type} size="sm">
            {el.label}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

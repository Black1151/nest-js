"use client";

import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import ThemeDropdown from "@/components/dropdowns/ThemeDropdown";
import ColorPaletteDropdown from "@/components/dropdowns/ColorPaletteDropdown";
import SimpleDropdown from "@/components/dropdowns/SimpleDropdown";


interface SlideToolbarProps {
  availableElements: { type: string; label: string }[];
  styleGroups: { id: number; name: string }[];
  selectedCollectionId: number | "";
  onSelectCollection: (id: number | "") => void;
  selectedThemeId: number | "";
  onSelectTheme: (id: number | "") => void;
  selectedPaletteId: number | "";
  onSelectPalette: (id: number | "") => void;
  selectedElementType: string | null;
  onSelectElement: (type: string) => void;
  selectedGroupId: number | "";
  onSelectGroup: (id: number | "") => void;
  styleItems: SlideElementDnDItemProps[];
}

export default function SlideToolbar({
  availableElements,
  styleGroups,
  selectedCollectionId,
  onSelectCollection,
  selectedThemeId,
  onSelectTheme,
  selectedPaletteId,
  onSelectPalette,
  selectedElementType,
  onSelectElement,
  selectedGroupId,
  onSelectGroup,
  styleItems,
}: SlideToolbarProps) {
  const groupOptions = useMemo(
    () => styleGroups.map((g) => ({ label: g.name, value: String(g.id) })),
    [styleGroups],
  );

  return (
    <>
      <Box p={4} borderWidth="1px" borderRadius="md">
        <HStack>
          {availableElements.map((el) => (
            <Box
              key={el.type}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", el.type)}
              bgColor="white"
            >
              {el.label}
            </Box>
          ))}
        </HStack>
      </Box>
      <VStack mt={2} alignItems="flex-start">
        <HStack w="full">
          <ThemeDropdown
            value={selectedThemeId === "" ? null : String(selectedThemeId)}
            onChange={(id) => onSelectTheme(id === null ? "" : parseInt(id, 10))}
            isDisabled={selectedCollectionId === ""}
          />
          <ColorPaletteDropdown
            collectionId={
              selectedCollectionId === "" ? null : String(selectedCollectionId)
            }
            value={selectedPaletteId === "" ? null : String(selectedPaletteId)}
            onChange={(id) =>
              onSelectPalette(id === null ? "" : parseInt(id, 10))
            }
            isDisabled={selectedCollectionId === ""}
          />
        </HStack>
        <HStack>
          {availableElements.map((el) => (
            <Button key={el.type} size="sm" onClick={() => onSelectElement(el.type)}>
              {el.label}
            </Button>
          ))}
        </HStack>
        {selectedElementType && (
          <SimpleDropdown
            options={groupOptions}
            value={selectedGroupId}
            onChange={(e) =>
              onSelectGroup(
                e.target.value === "" ? "" : parseInt(e.target.value, 10)
              )
            }
            isDisabled={selectedCollectionId === ""}
          />
        )}
      </VStack>
      {styleItems.length > 0 && (
        <HStack mt={2} overflowX="auto">
          {styleItems.map((item, idx) => (
            <Box
              key={idx}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({ type: item.type, config: item })
                )
              }
            >
              <SlideElementDnDItem item={item} />
            </Box>
          ))}
        </HStack>
      )}
    </>
  );
}

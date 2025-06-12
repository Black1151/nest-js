"use client";

import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";
import CrudDropdown from "@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown";


interface ThemeSlideToolbarProps {
  availableElements: { type: string; label: string }[];
  paletteOptions: { label: string; value: string }[];
  selectedPaletteId: number | "";
  onSelectPalette: (id: number | "") => void;
  onCreatePalette: () => void;
  onEditPalette: () => void;
  onDeletePalette: () => void;
  isPaletteDisabled?: boolean;
  selectedElementType: string | null;
  onSelectElement: (type: string) => void;
  groupOptions: { label: string; value: string }[];
  selectedGroupId: number | "";
  onSelectGroup: (id: number | "") => void;
  onCreateGroup: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  isGroupDisabled?: boolean;
  styleItems: SlideElementDnDItemProps[];
}

export default function ThemeSlideToolbar({
  availableElements,
  paletteOptions,
  selectedPaletteId,
  onSelectPalette,
  onCreatePalette,
  onEditPalette,
  onDeletePalette,
  isPaletteDisabled = false,
  selectedElementType,
  onSelectElement,
  groupOptions,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  isGroupDisabled = false,
  styleItems,
}: ThemeSlideToolbarProps) {

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
          <CrudDropdown
            options={paletteOptions}
            value={selectedPaletteId}
            onChange={(e) =>
              onSelectPalette(
                e.target.value === "" ? "" : parseInt(e.target.value, 10),
              )
            }
            onCreate={onCreatePalette}
            onUpdate={onEditPalette}
            onDelete={onDeletePalette}
            isDisabled={isPaletteDisabled}
            isUpdateDisabled={selectedPaletteId === ""}
            isDeleteDisabled={selectedPaletteId === ""}
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
          <CrudDropdown
            options={groupOptions}
            value={selectedGroupId}
            onChange={(e) =>
              onSelectGroup(
                e.target.value === "" ? "" : parseInt(e.target.value, 10),
              )
            }
            onCreate={onCreateGroup}
            onUpdate={onEditGroup}
            onDelete={onDeleteGroup}
            isDisabled={isGroupDisabled}
            isUpdateDisabled={selectedGroupId === ""}
            isDeleteDisabled={selectedGroupId === ""}
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

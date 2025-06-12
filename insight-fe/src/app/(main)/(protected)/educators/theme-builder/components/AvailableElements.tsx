import { Button, HStack } from "@chakra-ui/react";

/// this should be standardised with lesson editor
const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "quiz", label: "Quiz" },
];

interface AvailableElementsProps {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

export const AvailableElements = ({
  selectedType,
  onSelect,
}: AvailableElementsProps) => {
  return (
    <HStack w="100%">
      {AVAILABLE_ELEMENTS.map((el) => (
        <Button
          key={el.type}
          size="2xl"
          colorScheme={selectedType === el.type ? "blue" : undefined}
          onClick={() => onSelect(el.type)}
        >
          {el.label}
        </Button>
      ))}
    </HStack>
  );
};

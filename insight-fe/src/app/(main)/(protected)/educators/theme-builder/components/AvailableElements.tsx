import { Button, HStack, Text } from "@chakra-ui/react";

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
    <HStack w="50%" gap={4} pl={4}>
      {AVAILABLE_ELEMENTS.map((el) => (
        <Button
          key={el.type}
          size="lg"
          colorScheme={selectedType === el.type ? "green" : "yellow"}
          onClick={() => onSelect(el.type)}
          //   p={4}
        >
          <Text>{el.label}</Text>
        </Button>
      ))}
    </HStack>
  );
};

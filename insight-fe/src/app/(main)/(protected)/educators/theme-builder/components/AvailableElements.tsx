import { Button, HStack, Text, VStack } from "@chakra-ui/react";

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
    <VStack align="start" w="50%" pl={4} gap={2}>
      <Text fontSize="sm">Available Elements</Text>
      <HStack w="100%" gap={4}>
        {AVAILABLE_ELEMENTS.map((el) => (
          <Button
            key={el.type}
            size="lg"
            colorScheme={selectedType === el.type ? "green" : "yellow"}
            onClick={() => onSelect(el.type)}
          >
            <Text>{el.label}</Text>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

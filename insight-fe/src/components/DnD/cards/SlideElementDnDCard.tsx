import { ContentCard } from "@/components/layout/Card";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

export interface SlideElementDnDItemProps {
  id: string;
  type: string;
  /**
   * Text content for text elements
   */
  text?: string;
  styles?: {
    color?: string;
    fontSize?: string;
  };
}

interface SlideElementDnDItemComponentProps {
  item: SlideElementDnDItemProps;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const SlideElementDnDItem = ({
  item,
  onSelect,
  isSelected,
}: SlideElementDnDItemComponentProps) => {
  const baseProps = {
    id: item.id,
    cursor: "grab" as const,
    borderWidth: isSelected ? "2px" : undefined,
    borderColor: isSelected ? "blue.400" : undefined,
    onClick: onSelect,
  };

  if (item.type === "text") {
    return (
      <ContentCard {...baseProps}>
        <Text color={item.styles?.color} fontSize={item.styles?.fontSize}>
          {item.text || "Sample Text"}
        </Text>
      </ContentCard>
    );
  }

  if (item.type === "table") {
    return (
      <ContentCard {...baseProps}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Header 1</Th>
              <Th>Header 2</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Cell</Td>
              <Td>Cell</Td>
            </Tr>
          </Tbody>
        </Table>
      </ContentCard>
    );
  }

  return (
    <ContentCard {...baseProps}>
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ContentCard>
  );
};

import ElementWrapper, {
  ElementWrapperStyles,
} from "@/components/lesson/ElementWrapper";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export interface SlideElementDnDItemProps {
  id: string;
  type: string;
  /**
   * Text content for text elements
   */
  text?: string;
  /**
   * Video URL for video elements
   */
  url?: string;
  /**
   * Image source for image elements
   */
  src?: string;
  styles?: {
    color?: string;
    fontSize?: string;
  };
  wrapperStyles?: ElementWrapperStyles;
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
    onClick: onSelect,
  };

  const wrapperStyles: ElementWrapperStyles = {
    ...item.wrapperStyles,
    borderColor: isSelected ? "blue.400" : item.wrapperStyles?.borderColor,
    borderWidth: isSelected ? 2 : item.wrapperStyles?.borderWidth,
    borderRadius: item.wrapperStyles?.borderRadius,
  };

  if (item.type === "text") {
    return (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <Text color={item.styles?.color} fontSize={item.styles?.fontSize}>
          {item.text || "Sample Text"}
        </Text>
      </ElementWrapper>
    );
  }

  if (item.type === "table") {
    return (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
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
      </ElementWrapper>
    );
  }

  if (item.type === "video") {
    return (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <Box as="video" src={item.url} controls width="100%" />
      </ElementWrapper>
    );
  }

  if (item.type === "image") {
    return (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <img
          src={item.src}
          alt="lesson image"
          style={{ maxWidth: "100%" }}
          draggable={false}
        />
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper styles={wrapperStyles} {...baseProps}>
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ElementWrapper>
  );
};

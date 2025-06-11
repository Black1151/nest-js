import ElementWrapper, {
  ElementWrapperStyles,
} from "@/components/lesson/elements/ElementWrapper";
import { Box, Text, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import { motion } from "framer-motion";

export interface ElementAnimation {
  type: "flyInFade";
  direction: "left" | "right" | "top" | "bottom";
  delay: number;
}

export interface TableCell {
  text: string;
  styleOverrides?: {
    colorToken?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    lineHeight?: string;
    textAlign?: string;
  };
}

export interface SlideElementDnDItemProps {
  id: string;
  /** Style reference id when the element originates from the style library */
  styleId?: number;
  /** Component variant identifier */
  variantId?: number;
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
  /**
   * Quiz title when type is "quiz"
   */
  title?: string;
  /**
   * Quiz description when type is "quiz"
   */
  description?: string;
  /**
   * Quiz questions when type is "quiz"
   */
  questions?: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
  /**
   * Table configuration when type is "table"
   */
  table?: {
    rows: number;
    cols: number;
    cells: TableCell[][];
  };
  styleOverrides?: {
    colorToken?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    lineHeight?: string;
    textAlign?: string;
  };
  wrapperStyles?: ElementWrapperStyles;
  animation?: ElementAnimation;
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

  const MotionBox = motion(Box);

  const animationProps = item.animation
    ? {
        initial: {
          opacity: 0,
          x:
            item.animation.direction === "left"
              ? -50
              : item.animation.direction === "right"
              ? 50
              : 0,
          y:
            item.animation.direction === "top"
              ? -50
              : item.animation.direction === "bottom"
              ? 50
              : 0,
        },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: { delay: item.animation.delay / 1000 },
      }
    : {};

  const wrapperStyles: ElementWrapperStyles = {
    ...item.wrapperStyles,
    borderColor: isSelected ? "blue.400" : item.wrapperStyles?.borderColor,
    borderWidth: isSelected ? 2 : item.wrapperStyles?.borderWidth,
    borderRadius: item.wrapperStyles?.borderRadius,
  };

  let content: React.ReactElement = (
    <ElementWrapper styles={wrapperStyles} {...baseProps}>
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ElementWrapper>
  );

  if (item.type === "text") {
    content = (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <Text
          fontSize={item.styleOverrides?.fontSize}
          fontFamily={item.styleOverrides?.fontFamily}
          fontWeight={item.styleOverrides?.fontWeight}
          lineHeight={item.styleOverrides?.lineHeight}
          textAlign={item.styleOverrides?.textAlign as any}
        >
          {item.text || "Sample Text"}
        </Text>
      </ElementWrapper>
    );
  } else if (item.type === "table") {
    content = (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <Table size="sm">
          <Tbody>
            {item.table?.cells.map((row, rIdx) => (
              <Tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <Td key={cIdx} p={1}>
                    <Text
                      fontSize={cell.styleOverrides?.fontSize}
                      fontFamily={cell.styleOverrides?.fontFamily}
                      fontWeight={cell.styleOverrides?.fontWeight}
                      lineHeight={cell.styleOverrides?.lineHeight}
                      textAlign={cell.styleOverrides?.textAlign as any}
                    >
                      {cell.text}
                    </Text>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ElementWrapper>
    );
  } else if (item.type === "video") {
    content = (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <Box as="video" src={item.url} controls width="100%" />
      </ElementWrapper>
    );
  } else if (item.type === "image") {
    content = (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <img
          src={item.src}
          alt="lesson image"
          style={{ maxWidth: "100%" }}
          draggable={false}
        />
      </ElementWrapper>
    );
  } else if (item.type === "quiz") {
    content = (
      <ElementWrapper styles={wrapperStyles} {...baseProps}>
        <Text fontWeight="bold">{item.title || "Quiz"}</Text>
      </ElementWrapper>
    );
  }

  return <MotionBox {...animationProps}>{content}</MotionBox>;
};

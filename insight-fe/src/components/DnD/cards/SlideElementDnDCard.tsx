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
import { useCallback, useEffect, useState } from "react";
import {
  DnDBoardMain,
  BoardState,
} from "../DnDBoardMain";
import { ColumnMap, ColumnType } from "../types";

export const createRowContainerBoard = (): BoardState<SlideElementDnDItemProps> => {
  const colors = ["red.300", "green.300", "blue.300"];
  const columnMap: ColumnMap<SlideElementDnDItemProps> = {};
  const orderedColumnIds: string[] = [];
  colors.forEach((color, idx) => {
    const id = `col-${crypto.randomUUID()}`;
    const column: ColumnType<SlideElementDnDItemProps> = {
      title: `Column ${idx + 1}`,
      columnId: id,
      styles: {
        container: { border: `2px dashed ${color}`, width: "100%" },
        header: { bg: color, color: "white" },
      },
      items: [],
    };
    columnMap[id] = column;
    orderedColumnIds.push(id);
  });
  return { columnMap, orderedColumnIds, lastOperation: null };
};

export interface SlideElementDnDItemProps {
  id: string;
  type: string;
  styles?: {
    color?: string;
    fontSize?: string;
  };
  board?: BoardState<SlideElementDnDItemProps>;
}

interface SlideElementDnDItemComponentProps {
  item: SlideElementDnDItemProps;
  onSelect?: () => void;
  isSelected?: boolean;
  onChange?: (item: SlideElementDnDItemProps) => void;
}

export const SlideElementDnDItem = ({
  item,
  onSelect,
  isSelected,
  onChange,
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
          Sample Text
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

  if (item.type === "row") {
    const [board, setBoard] = useState<BoardState<SlideElementDnDItemProps>>(
      item.board ?? createRowContainerBoard()
    );

    useEffect(() => {
      onChange?.({ ...item, board });
    }, [board]);

    const NestedCard = useCallback(
      ({ item }: { item: SlideElementDnDItemProps }) => (
        <SlideElementDnDItem item={item} onChange={onChange} />
      ),
      [onChange]
    );

    return (
      <ContentCard {...baseProps} cursor="default">
        <DnDBoardMain<SlideElementDnDItemProps>
          controlled
          columnMap={board.columnMap}
          orderedColumnIds={board.orderedColumnIds}
          CardComponent={NestedCard}
          onChange={setBoard}
          enableColumnReorder={false}
        />
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

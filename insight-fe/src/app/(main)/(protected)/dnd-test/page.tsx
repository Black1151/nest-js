import { Board } from "@/components/DnD/board";
import { TBoard, TCard, TColumn } from "@/components/DnD/data";
import { Flex } from "@chakra-ui/react";

function getInitialData(): TBoard {
  // Doing this so we get consistent ids on server and client
  const getCards = (() => {
    let count = 0;

    return function getCards({ amount }: { amount: number }): TCard[] {
      return Array.from({ length: amount }, () => {
        const id = count++;
        return {
          id: `card:${id}`,
          description: `Card ${id}`,
        };
      });
    };
  })();

  const columns: TColumn[] = [
    { id: "column:a", title: "Column A", cards: getCards({ amount: 60 }) },
  ];

  return {
    columns,
  };
}

export default function Page() {
  return (
    <Flex flexDirection="row" justifyContent="center" height="100%">
      <Board initial={getInitialData()} />
    </Flex>
  );
}

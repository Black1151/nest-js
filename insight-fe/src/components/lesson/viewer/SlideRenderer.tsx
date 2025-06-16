import { VStack, HStack } from "@chakra-ui/react";
import { Slide } from "@/components/lesson/slide/SlideSequencer";
import { SlideElementDnDItem } from "@/components/DnD/cards/SlideElementDnDCard";

interface SlideRendererProps {
  slide: Slide;
}

export default function SlideRenderer({ slide }: SlideRendererProps) {
  return (
    <VStack spacing={4} w="100%" align="stretch">
      {slide.boards.map((board) => (
        <HStack key={board.id} spacing={board.spacing ?? 4} w="100%" align="start">
          {board.orderedColumnIds.map((cid) => {
            const column = slide.columnMap[cid];
            if (!column) return null;
            return (
              <VStack
                key={cid}
                spacing={column.spacing ?? 2}
                w="100%"
                align="stretch"
              >
                {column.items.map((item) => (
                  <SlideElementDnDItem key={item.id} item={item} />
                ))}
              </VStack>
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
}

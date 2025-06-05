"use client";

import { Flex, Grid, Box, Text, HStack, Button } from "@chakra-ui/react";
import SlideSequencer, { Slide } from "./SlideSequencer";
import SlideElementsContainer, { BoardRow } from "./SlideElementsContainer";
import ElementAttributesPane from "./ElementAttributesPane";
import ColumnAttributesPane from "./ColumnAttributesPane";
import BoardAttributesPane from "./BoardAttributesPane";
import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface SlideCanvasProps {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  selectedSlideId: string | null;
  selectSlide: (id: string) => void;
  selectedSlide: Slide | null;
  selectedElement: SlideElementDnDItemProps | null;
  selectedColumn: ColumnType<SlideElementDnDItemProps> | null;
  selectedBoard: BoardRow | null;
  dropIndicator: { columnId: string; index: number } | null;
  selectElement: (id: string | null) => void;
  selectColumn: (id: string | null) => void;
  selectBoard: (id: string | null) => void;
  updateElement: (el: SlideElementDnDItemProps) => void;
  cloneElement: () => void;
  deleteElement: () => void;
  updateColumn: (col: ColumnType<SlideElementDnDItemProps>) => void;
  updateBoard: (board: BoardRow) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDropElement: (e: React.DragEvent<HTMLDivElement>) => void;
  openSaveStyle: () => void;
  openLoadStyle: () => void;
}

export default function SlideCanvas({
  slides,
  setSlides,
  selectedSlideId,
  selectSlide,
  selectedSlide,
  selectedElement,
  selectedColumn,
  selectedBoard,
  dropIndicator,
  selectElement,
  selectColumn,
  selectBoard,
  updateElement,
  cloneElement,
  deleteElement,
  updateColumn,
  updateBoard,
  handleDragOver,
  handleDropElement,
  openSaveStyle,
  openLoadStyle,
}: SlideCanvasProps) {
  return (
    <Flex gap={6} alignItems="flex-start">
      <SlideSequencer
        slides={slides}
        setSlides={setSlides as any}
        selectedSlideId={selectedSlideId}
        onSelect={selectSlide}
      />
      {selectedSlideId && selectedSlide && (
        <Grid gap={4} flex={1} templateColumns="1fr 300px">
          <Box
            flex="1"
            p={4}
            borderWidth="1px"
            borderRadius="md"
            onDragOver={handleDragOver}
            onDragLeave={() => selectElement(null)}
            onDrop={handleDropElement}
          >
            <Text mb={2}>Slide Elements</Text>
            <SlideElementsContainer
              columnMap={selectedSlide.columnMap}
              boards={selectedSlide.boards}
              onChange={(columnMap, boards) =>
                setSlides((s) =>
                  s.map((sl) =>
                    sl.id === selectedSlideId
                      ? { ...sl, columnMap, boards }
                      : sl
                  )
                )
              }
              selectedElementId={selectedElement ? selectedElement.id : null}
              onSelectElement={(id) => selectElement(id)}
              dropIndicator={dropIndicator}
              selectedColumnId={selectedColumn ? selectedColumn.columnId : null}
              onSelectColumn={(id) => selectColumn(id)}
              selectedBoardId={selectedBoard ? selectedBoard.id : null}
              onSelectBoard={(id) => selectBoard(id)}
            />
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="md" minW="200px">
            <HStack justify="space-between" mb={2}>
              <Text>Attributes</Text>
              <HStack>
                <Button size="xs" onClick={openLoadStyle}>
                  Load Style
                </Button>
                <Button size="xs" onClick={openSaveStyle}>
                  Save Style
                </Button>
              </HStack>
            </HStack>
            {selectedElement && (
              <ElementAttributesPane
                element={selectedElement}
                onChange={updateElement}
                onClone={cloneElement}
                onDelete={deleteElement}
              />
            )}
            {selectedColumn && (
              <ColumnAttributesPane
                column={selectedColumn}
                onChange={updateColumn}
              />
            )}
            {selectedBoard && (
              <BoardAttributesPane
                board={selectedBoard}
                onChange={updateBoard}
              />
            )}
          </Box>
        </Grid>
      )}
    </Flex>
  );
}

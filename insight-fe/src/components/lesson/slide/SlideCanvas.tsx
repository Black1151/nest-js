"use client";

  import { Flex, Grid, Box, Text, HStack, Button } from "@chakra-ui/react";

import BoardAttributesPane from "../attributes-pane/BoardAttributesPane";
import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import ColumnAttributesPane from "../attributes-pane/ColumnAttributesPane";
import ElementAttributesPane from "../attributes-pane/ElementAttributesPane";
import SlideElementsContainer, { BoardRow } from "./SlideElementsContainer";
import SlideSequencer, { Slide } from "./SlideSequencer";
import { ComponentVariant, SemanticTokens } from "@/theme/helpers";

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
  tokens?: SemanticTokens;
  variants?: ComponentVariant[];
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
  tokens,
  variants,
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
              tokens={tokens}
              variants={variants}
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
                tokens={tokens}
                variants={variants}
              />
            )}
            {selectedColumn && (
              <ColumnAttributesPane
                column={selectedColumn}
                onChange={updateColumn}
                tokens={tokens}
              />
            )}
            {selectedBoard && (
              <BoardAttributesPane
                board={selectedBoard}
                onChange={updateBoard}
                tokens={tokens}
              />
            )}
          </Box>
        </Grid>
      )}
    </Flex>
  );
}

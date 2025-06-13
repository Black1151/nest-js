"use client";

import { Box, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import SlideElementsContainer, { BoardRow } from "@/components/lesson/slide/SlideElementsContainer";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createInitialBoard } from "@/components/lesson/slide/SlideSequencer";
import { availableFonts } from "@/theme/fonts";
import { defaultColumnWrapperStyles } from "@/components/lesson/defaultStyles";
import ThemeAttributesPane from "./ThemeAttributesPane";
import SaveElementModal from "./SaveElementModal";
import { CREATE_STYLE, GET_COLOR_PALETTES } from "@/graphql/lesson";

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};
interface ThemeCanvasProps {
  collectionId: number | null;
  paletteId: number | null;
}

export default function ThemeCanvas({ collectionId, paletteId }: ThemeCanvasProps) {
  const initial = createInitialBoard();
  const [columnMap, setColumnMap] = useState<ColumnMap<SlideElementDnDItemProps>>(initial.columnMap);
  const [boards, setBoards] = useState<BoardRow[]>(initial.boards);
  const [dropIndicator, setDropIndicator] = useState<{ columnId: string; index: number } | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const [createStyle] = useMutation(CREATE_STYLE);

  const { data: paletteData } = useQuery(GET_COLOR_PALETTES, {
    variables: { collectionId: String(collectionId) },
    skip: collectionId === null,
    fetchPolicy: "network-only",
  });

  const colorPalettes = (paletteData?.getAllColorPalette || []).map((p: any) => ({
    id: Number(p.id),
    name: p.name,
    colors: p.colors,
  }));

  const handleChange = (
    map: ColumnMap<SlideElementDnDItemProps>,
    b: BoardRow[]
  ) => {
    setColumnMap(map);
    setBoards(b);
  };

  const updateElement = (updated: SlideElementDnDItemProps) => {
    setColumnMap((prev) => {
      const newMap = { ...prev };
      for (const board of boards) {
        for (const colId of board.orderedColumnIds) {
          const col = newMap[colId];
          const idx = col.items.findIndex((i) => i.id === updated.id);
          if (idx !== -1) {
            newMap[colId] = {
              ...col,
              items: [...col.items.slice(0, idx), updated, ...col.items.slice(idx + 1)],
            };
            return newMap;
          }
        }
      }
      return newMap;
    });
  };

  const updateColumn = (updated: ColumnType<SlideElementDnDItemProps>) => {
    setColumnMap((prev) => ({ ...prev, [updated.columnId]: updated }));
  };

  const updateBoard = (updated: BoardRow) => {
    setBoards((bs) => bs.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleDropElement = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    let type = raw;
    let config: SlideElementDnDItemProps | null = null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        type = parsed.type;
        config = parsed.config as SlideElementDnDItemProps;
      }
    } catch {
      /* ignore */
    }
    if (!type) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;
    setColumnMap((prev) => {
      const firstColumn = boards[0].orderedColumnIds[0];
      const columnId = dropColumnId && prev[dropColumnId] ? dropColumnId : firstColumn;
      const column = prev[columnId];
      let insertIndex = column.items.length;
      if (columnEl) {
        const cards = Array.from(columnEl.querySelectorAll("[data-card-id]")) as HTMLElement[];
        for (let i = 0; i < cards.length; i++) {
          const rect = cards[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            insertIndex = i;
            break;
          }
        }
      }
      const newEl: SlideElementDnDItemProps = config
        ? { ...config, id: crypto.randomUUID() }
        : {
            id: crypto.randomUUID(),
            type,
            ...(type === "text"
              ? {
                  text: "Sample Text",
                  styles: {
                    color: "#000000",
                    fontSize: "16px",
                    fontFamily: availableFonts[0].fontFamily,
                    fontWeight: "normal",
                    lineHeight: "1.2",
                    textAlign: "left",
                  },
                }
              : type === "image"
              ? { src: "https://via.placeholder.com/150" }
              : type === "video"
              ? { url: "" }
              : type === "quiz"
              ? { title: "Untitled Quiz", description: "", questions: [] }
              : type === "table"
              ? {
                  table: {
                    rows: 2,
                    cols: 2,
                    cells: Array.from({ length: 2 }, () =>
                      Array.from({ length: 2 }, () => ({
                        text: "Cell",
                        styles: {
                          color: "#000000",
                          fontSize: "14px",
                          fontFamily: availableFonts[0].fontFamily,
                          fontWeight: "normal",
                          lineHeight: "1.2",
                          textAlign: "left",
                        },
                      }))
                    ),
                  },
                }
              : {}),
            wrapperStyles: { ...defaultColumnWrapperStyles },
            animation: undefined,
          };
      const updatedColumn = {
        ...column,
        items: [
          ...column.items.slice(0, insertIndex),
          newEl,
          ...column.items.slice(insertIndex),
        ],
      };
      return { ...prev, [columnId]: updatedColumn };
    });
    setDropIndicator(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (!type) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;
    if (!dropColumnId) {
      setDropIndicator(null);
      return;
    }
    const column = columnMap[dropColumnId];
    if (!column) return;
    let insertIndex = column.items.length;
    if (columnEl) {
      const cards = Array.from(columnEl.querySelectorAll("[data-card-id]")) as HTMLElement[];
      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          insertIndex = i;
          break;
        }
      }
    }
    setDropIndicator({ columnId: dropColumnId, index: insertIndex });
  };

  const selectedElement = (() => {
    if (!selectedElementId) return null;
    for (const board of boards) {
      for (const colId of board.orderedColumnIds) {
        const col = columnMap[colId];
        const item = col.items.find((i) => i.id === selectedElementId);
        if (item) return item;
      }
    }
    return null;
  })();

  const selectedColumn = selectedColumnId ? columnMap[selectedColumnId] || null : null;
  const selectedBoard = selectedBoardId ? boards.find((b) => b.id === selectedBoardId) || null : null;

  const handleSave = async ({ name, groupId }: { name: string; groupId: number | null }) => {
    if (!selectedElement || collectionId === null) return;
    await createStyle({
      variables: {
        data: {
          name,
          collectionId,
          groupId: groupId ?? undefined,
          element: ELEMENT_TYPE_TO_ENUM[selectedElement.type],
          config: selectedElement,
        },
      },
    });
    setIsSaveOpen(false);
  };

  return (
    <HStack
      w="100%"
      mt={4}
      align="start"
      onDragOver={handleDragOver}
      onDrop={handleDropElement}
      onDragLeave={() => setDropIndicator(null)}
      spacing={4}
    >
      <Box flex="1">
        <SlideElementsContainer
          columnMap={columnMap}
          boards={boards}
          onChange={handleChange}
          dropIndicator={dropIndicator}
          selectedElementId={selectedElementId}
          onSelectElement={(id) => setSelectedElementId(id)}
          selectedColumnId={selectedColumnId}
          onSelectColumn={(id) => setSelectedColumnId(id)}
          selectedBoardId={selectedBoardId}
          onSelectBoard={(id) => setSelectedBoardId(id)}
        />
      </Box>
      <ThemeAttributesPane
        element={selectedElement}
        column={selectedColumn}
        board={selectedBoard}
        onUpdateElement={updateElement}
        onUpdateColumn={updateColumn}
        onUpdateBoard={updateBoard}
        onSave={() => setIsSaveOpen(true)}
        colorPalettes={colorPalettes}
        selectedPaletteId={paletteId ?? ""}
      />
      {isSaveOpen && selectedElement && collectionId !== null && (
        <SaveElementModal
          isOpen={isSaveOpen}
          onClose={() => setIsSaveOpen(false)}
          collectionId={collectionId}
          elementType={selectedElement.type}
          onSave={handleSave}
        />
      )}
    </HStack>
  );
}

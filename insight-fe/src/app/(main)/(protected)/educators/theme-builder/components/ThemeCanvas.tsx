"use client";

import { Box, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import SlideElementsContainer, {
  BoardRow,
} from "@/components/lesson/slide/SlideElementsContainer";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap, ColumnType } from "@/components/DnD/types";
import { createInitialBoard } from "@/components/lesson/slide/SlideSequencer";
import { availableFonts } from "@/theme/fonts";
import {
  defaultColumnWrapperStyles,
  defaultBoardWrapperStyles,
} from "@/components/lesson/defaultStyles";
import ThemeAttributesPane from "./ThemeAttributesPane";
import DeleteDropArea from "./DeleteDropArea";
import SaveElementModal from "./SaveElementModal";
import { CREATE_STYLE, GET_COLOR_PALETTES } from "@/graphql/lesson";

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  row: "Row",
  column: "Column",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};
interface ThemeCanvasProps {
  themeId: number | null;
  paletteId: number | null;
}

export default function ThemeCanvas({
  themeId,
  paletteId,
}: ThemeCanvasProps) {
  const initial = createInitialBoard();
  const [columnMap, setColumnMap] = useState<
    ColumnMap<SlideElementDnDItemProps>
  >(initial.columnMap);
  const [boards, setBoards] = useState<BoardRow[]>(initial.boards);
  const [dropIndicator, setDropIndicator] = useState<{
    columnId: string;
    index: number;
  } | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const selectElement = (id: string | null) => {
    setSelectedElementId(id);
    setSelectedColumnId(null);
    setSelectedBoardId(null);
  };

  const selectColumn = (id: string | null) => {
    setSelectedColumnId(id);
    setSelectedElementId(null);
    setSelectedBoardId(null);
  };

  const selectBoard = (id: string | null) => {
    setSelectedBoardId(id);
    setSelectedElementId(null);
    setSelectedColumnId(null);
  };
  const [saveTarget, setSaveTarget] = useState<
    "element" | "column" | "row" | null
  >(null);

  const [createStyle] = useMutation(CREATE_STYLE);

  const { data: paletteData, refetch: refetchPalettes } = useQuery(
    GET_COLOR_PALETTES,
    {
      variables: { collectionId: null },
      fetchPolicy: "network-only",
    },
  );

  useEffect(() => {
    refetchPalettes({ collectionId: null });
  }, [paletteId, refetchPalettes]);

  const colorPalettes = (paletteData?.getAllColorPalette || []).map(
    (p: any) => ({
      id: Number(p.id),
      name: p.name,
      colors: p.colors,
    }),
  );

  const handleChange = (
    map: ColumnMap<SlideElementDnDItemProps>,
    b: BoardRow[],
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
              items: [
                ...col.items.slice(0, idx),
                updated,
                ...col.items.slice(idx + 1),
              ],
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

  const cloneElement = () => {
    if (!selectedElementId) return;
    setColumnMap((prev) => {
      const newMap = { ...prev };
      for (const board of boards) {
        for (const colId of board.orderedColumnIds) {
          const col = newMap[colId];
          const idx = col.items.findIndex((i) => i.id === selectedElementId);
          if (idx !== -1) {
            const orig = col.items[idx];
            const copy = { ...orig, id: crypto.randomUUID() };
            newMap[colId] = {
              ...col,
              items: [
                ...col.items.slice(0, idx + 1),
                copy,
                ...col.items.slice(idx + 1),
              ],
            };
            return newMap;
          }
        }
      }
      return newMap;
    });
  };

  const deleteElementById = (id: string) => {
    setColumnMap((prev) => {
      const newMap = { ...prev };
      for (const board of boards) {
        for (const colId of board.orderedColumnIds) {
          const col = newMap[colId];
          const idx = col.items.findIndex((i) => i.id === id);
          if (idx !== -1) {
            newMap[colId] = {
              ...col,
              items: [...col.items.slice(0, idx), ...col.items.slice(idx + 1)],
            };
            return newMap;
          }
        }
      }
      return newMap;
    });
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const deleteColumnById = (id: string) => {
    setColumnMap((prev) => {
      if (!prev[id]) return prev;
      const column = prev[id];
      const newMap = { ...prev };
      delete newMap[id];
      if (
        selectedElementId &&
        column.items.some((i) => i.id === selectedElementId)
      ) {
        setSelectedElementId(null);
      }
      return newMap;
    });
    setBoards((prev) =>
      prev
        .map((b) => ({
          ...b,
          orderedColumnIds: b.orderedColumnIds.filter((cid) => cid !== id),
        }))
        .filter((b) => b.orderedColumnIds.length > 0),
    );
    if (selectedColumnId === id) {
      setSelectedColumnId(null);
    }
  };

  const deleteBoardById = (id: string) => {
    setBoards((prev) => {
      if (prev.length <= 1) return prev;
      const board = prev.find((b) => b.id === id);
      if (!board) return prev;
      setColumnMap((map) => {
        const newMap = { ...map };
        for (const colId of board.orderedColumnIds) {
          const column = map[colId];
          if (
            selectedElementId &&
            column?.items.some((i) => i.id === selectedElementId)
          ) {
            setSelectedElementId(null);
          }
          if (selectedColumnId === colId) {
            setSelectedColumnId(null);
          }
          delete newMap[colId];
        }
        return newMap;
      });
      if (selectedBoardId === id) {
        setSelectedBoardId(null);
      }
      return prev.filter((b) => b.id !== id);
    });
  };

  const deleteElement = () => {
    if (!selectedElementId) return;
    deleteElementById(selectedElementId);
  };

  const handleDropElement = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    let type = raw;
    let config: any = null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        type = parsed.type;
        config = parsed.config as any;
      }
    } catch {
      /* ignore */
    }
    if (!type) return;
    if (type === "row") {
      const columnId = `col-${crypto.randomUUID()}`;
      const boardId = crypto.randomUUID();
      const newColumn: ColumnType<SlideElementDnDItemProps> = {
        title: "",
        columnId,
        styles: { container: { border: "1px dashed gray", width: "100%" } },
        wrapperStyles: { ...defaultColumnWrapperStyles },
        items: [],
        spacing: 0,
      };
      const boardConfig = config as Partial<BoardRow> | null;
      setColumnMap((prev) => ({ ...prev, [columnId]: newColumn }));
      setBoards((b) => [
        ...b,
        {
          id: boardId,
          orderedColumnIds: [columnId],
          wrapperStyles: boardConfig?.wrapperStyles ?? {
            ...defaultBoardWrapperStyles,
          },
          spacing: boardConfig?.spacing ?? 0,
        },
      ]);
      return;
    }

    if (type === "column") {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const boardEl = target?.closest("[data-board-id]") as HTMLElement | null;
      const deleteArea = target?.closest("[data-delete-area]");
      if (!boardEl || deleteArea) return;
      const boardId = boardEl.dataset.boardId;
      if (!boardId) return;
      const columnId = `col-${crypto.randomUUID()}`;
      const colConfig = config as Partial<
        ColumnType<SlideElementDnDItemProps>
      > | null;
      const newColumn: ColumnType<SlideElementDnDItemProps> = {
        title: "",
        columnId,
        styles: colConfig?.styles ?? {
          container: { border: "1px dashed gray", width: "100%" },
        },
        wrapperStyles: colConfig?.wrapperStyles ?? {
          ...defaultColumnWrapperStyles,
        },
        items: [],
        spacing: colConfig?.spacing ?? 0,
      };
      setColumnMap((prev) => ({ ...prev, [columnId]: newColumn }));
      setBoards((prev) =>
        prev.map((b) =>
          b.id === boardId
            ? { ...b, orderedColumnIds: [...b.orderedColumnIds, columnId] }
            : b,
        ),
      );
      return;
    }
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const columnEl = target?.closest("[data-column-id]") as HTMLElement | null;
    const dropColumnId = columnEl?.dataset.columnId;
    setColumnMap((prev) => {
      const firstColumn = boards[0].orderedColumnIds[0];
      const columnId =
        dropColumnId && prev[dropColumnId] ? dropColumnId : firstColumn;
      const column = prev[columnId];
      let insertIndex = column.items.length;
      if (columnEl) {
        const cards = Array.from(
          columnEl.querySelectorAll("[data-card-id]"),
        ) as HTMLElement[];
        for (let i = 0; i < cards.length; i++) {
          const rect = cards[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            insertIndex = i;
            break;
          }
        }
      }
      const newEl: SlideElementDnDItemProps = config
        ? { ...config, id: crypto.randomUUID(), styleId: config.styleId }
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
                              })),
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
    if (!type || type === "column" || type === "row") return;
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
      const cards = Array.from(
        columnEl.querySelectorAll("[data-card-id]"),
      ) as HTMLElement[];
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

  const selectedColumn = selectedColumnId
    ? columnMap[selectedColumnId] || null
    : null;
  const selectedBoard = selectedBoardId
    ? boards.find((b) => b.id === selectedBoardId) || null
    : null;

  const handleSave = async (name: string) => {
    if (themeId === null || !saveTarget) return;
    let elementType: string;
    let config: any;
    if (saveTarget === "element") {
      if (!selectedElement) return;
      elementType = selectedElement.type;
      config = selectedElement;
    } else if (saveTarget === "column") {
      if (!selectedColumn) return;
      elementType = "column";
      config = selectedColumn;
    } else {
      if (!selectedBoard) return;
      elementType = "row";
      config = selectedBoard;
    }

    await createStyle({
      variables: {
        data: {
          name,
          themeId,
          element: ELEMENT_TYPE_TO_ENUM[elementType],
          config,
        },
      },
    });
    setSaveTarget(null);
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
          onSelectElement={selectElement}
          selectedColumnId={selectedColumnId}
          onSelectColumn={selectColumn}
          selectedBoardId={selectedBoardId}
          onSelectBoard={selectBoard}
        />
      </Box>
      <VStack align="stretch">
        <ThemeAttributesPane
          element={selectedElement}
          column={selectedColumn}
          board={selectedBoard}
          onUpdateElement={updateElement}
          onUpdateColumn={updateColumn}
          onUpdateBoard={updateBoard}
          onSave={setSaveTarget}
          onClone={cloneElement}
          onDelete={deleteElement}
          colorPalettes={colorPalettes}
          selectedPaletteId={paletteId ?? ""}
        />
        <DeleteDropArea
          onDropCard={deleteElementById}
          onDropColumn={deleteColumnById}
          onDropBoard={deleteBoardById}
        />
      </VStack>
      {saveTarget && themeId !== null && (
        <SaveElementModal
          isOpen={saveTarget !== null}
          onClose={() => setSaveTarget(null)}
          onSave={handleSave}
        />
      )}
    </HStack>
  );
}

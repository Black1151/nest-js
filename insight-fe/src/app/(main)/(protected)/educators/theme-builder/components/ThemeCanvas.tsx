"use client";

import { Box } from "@chakra-ui/react";
import { useState } from "react";
import SlideElementsContainer, { BoardRow } from "@/components/lesson/slide/SlideElementsContainer";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnMap } from "@/components/DnD/types";
import { createInitialBoard } from "@/components/lesson/slide/SlideSequencer";
import { availableFonts } from "@/theme/fonts";
import { defaultColumnWrapperStyles } from "@/components/lesson/defaultStyles";

export default function ThemeCanvas() {
  const initial = createInitialBoard();
  const [columnMap, setColumnMap] = useState<ColumnMap<SlideElementDnDItemProps>>(initial.columnMap);
  const [boards, setBoards] = useState<BoardRow[]>(initial.boards);
  const [dropIndicator, setDropIndicator] = useState<{ columnId: string; index: number } | null>(null);

  const handleChange = (
    map: ColumnMap<SlideElementDnDItemProps>,
    b: BoardRow[]
  ) => {
    setColumnMap(map);
    setBoards(b);
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

  return (
    <Box
      w="100%"
      mt={4}
      onDragOver={handleDragOver}
      onDrop={handleDropElement}
      onDragLeave={() => setDropIndicator(null)}
    >
      <SlideElementsContainer
        columnMap={columnMap}
        boards={boards}
        onChange={handleChange}
        dropIndicator={dropIndicator}
      />
    </Box>
  );
}

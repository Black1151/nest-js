"use client";

import { Flex, Box, Text, Grid, HStack, Button, Select } from "@chakra-ui/react";
import {
  useCallback,
  useReducer,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import SlideSequencer, { Slide, createInitialBoard } from "./SlideSequencer";
import SlideElementsContainer, { BoardRow } from "./SlideElementsContainer";
import ElementAttributesPane from "./ElementAttributesPane";
import ColumnAttributesPane from "./ColumnAttributesPane";
import BoardAttributesPane from "./BoardAttributesPane";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { ColumnType } from "@/components/DnD/types";
import { availableFonts } from "@/theme/fonts";
import SaveStyleModal from "./SaveStyleModal";
import LoadStyleModal from "./LoadStyleModal";

const GET_STYLE_COLLECTIONS = gql`
  query GetStyleCollections {
    getAllStyleCollection(data: { all: true }) {
      id
      name
    }
  }
`;

const CREATE_STYLE = gql`
  mutation CreateStyle($data: CreateStyleInput!) {
    createStyle(data: $data) {
      id
      name
    }
  }
`;

interface LessonState {
  slides: Slide[];
  selectedSlideId: string | null;
  selectedElementId: string | null;
  selectedColumnId: string | null;
  selectedBoardId: string | null;
  dropIndicator: { columnId: string; index: number } | null;
}

type Action =
  | { type: "setSlides"; updater: React.SetStateAction<Slide[]> }
  | { type: "selectSlide"; id: string | null }
  | { type: "selectElement"; id: string | null }
  | { type: "selectColumn"; id: string | null }
  | { type: "selectBoard"; id: string | null }
  | {
      type: "setDropIndicator";
      indicator: { columnId: string; index: number } | null;
    }
  | { type: "updateSlide"; slideId: string; updater: (slide: Slide) => Slide }
  | {
      type: "updateBoard";
      slideId: string;
      boardId: string;
      updater: (board: BoardRow) => BoardRow;
    };

function reducer(state: LessonState, action: Action): LessonState {
  switch (action.type) {
    case "setSlides": {
      const slides =
        typeof action.updater === "function"
          ? (action.updater as (prev: Slide[]) => Slide[])(state.slides)
          : action.updater;
      return { ...state, slides };
    }
    case "selectSlide":
      return {
        ...state,
        selectedSlideId: action.id,
        selectedElementId: null,
        selectedColumnId: null,
        selectedBoardId: null,
      };
    case "selectElement":
      return {
        ...state,
        selectedElementId: action.id,
        selectedColumnId: null,
        selectedBoardId: null,
      };
    case "selectColumn":
      return {
        ...state,
        selectedColumnId: action.id,
        selectedElementId: null,
        selectedBoardId: null,
      };
    case "selectBoard":
      return {
        ...state,
        selectedBoardId: action.id,
        selectedColumnId: null,
        selectedElementId: null,
      };
    case "setDropIndicator":
      return { ...state, dropIndicator: action.indicator };
    case "updateSlide":
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId ? action.updater(s) : s
        ),
      };
    case "updateBoard":
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId
            ? {
                ...s,
                boards: s.boards.map((b) =>
                  b.id === action.boardId ? action.updater(b) : b
                ),
              }
            : s
        ),
      };
    default:
      return state;
  }
}

const AVAILABLE_ELEMENTS = [
  { type: "text", label: "Text" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "quiz", label: "Quiz" },
];

const ELEMENT_TYPE_TO_ENUM: Record<string, string> = {
  text: "Text",
  table: "Table",
  image: "Image",
  video: "Video",
  quiz: "Quiz",
};

export interface LessonEditorHandle {
  getContent: () => { slides: Slide[] };
  setContent: (slides: Slide[]) => void;
}

const LessonEditor = forwardRef<LessonEditorHandle>(function LessonEditor(
  _,
  ref
) {
  const initialSlide = {
    id: crypto.randomUUID(),
    title: "Slide 1",
    ...createInitialBoard(),
  };
  const [state, dispatch] = useReducer(reducer, {
    slides: [initialSlide],
    selectedSlideId: initialSlide.id,
    selectedElementId: null,
    selectedColumnId: null,
    selectedBoardId: null,
    dropIndicator: null,
  });

  const [styleCollections, setStyleCollections] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | "">(
    ""
  );
  const [isSaveStyleOpen, setIsSaveStyleOpen] = useState(false);
  const [isLoadStyleOpen, setIsLoadStyleOpen] = useState(false);

  const { data: collectionsData } = useQuery(GET_STYLE_COLLECTIONS);
  const [createStyle] = useMutation(CREATE_STYLE);

  useEffect(() => {
    if (collectionsData?.getAllStyleCollection) {
      setStyleCollections(collectionsData.getAllStyleCollection);
    }
  }, [collectionsData]);

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => ({ slides: state.slides }),
      setContent: (slides: Slide[]) => {
        dispatch({ type: "setSlides", updater: slides });
        dispatch({ type: "selectSlide", id: slides[0]?.id ?? null });
      },
    }),
    [state.slides, dispatch]
  );

  const setSlides = useCallback(
    (updater: React.SetStateAction<Slide[]>) =>
      dispatch({ type: "setSlides", updater }),
    [dispatch]
  );

  const selectedSlide = useMemo(
    () => state.slides.find((s) => s.id === state.selectedSlideId) || null,
    [state.slides, state.selectedSlideId]
  );

  const selectedElement = useMemo(() => {
    if (!selectedSlide || !state.selectedElementId) return null;
    for (const board of selectedSlide.boards) {
      for (const colId of board.orderedColumnIds) {
        const col = selectedSlide.columnMap[colId];
        const item = col.items.find((i) => i.id === state.selectedElementId);
        if (item) return item;
      }
    }
    return null;
  }, [selectedSlide, state.selectedElementId]);

  const selectedColumn = useMemo(() => {
    if (!selectedSlide || !state.selectedColumnId) return null;
    return selectedSlide.columnMap[state.selectedColumnId] || null;
  }, [selectedSlide, state.selectedColumnId]);

  const selectedBoard = useMemo(() => {
    if (!selectedSlide || !state.selectedBoardId) return null;
    return (
      selectedSlide.boards.find((b) => b.id === state.selectedBoardId) || null
    );
  }, [selectedSlide, state.selectedBoardId]);

  const updateElement = useCallback(
    (updated: SlideElementDnDItemProps) => {
      if (!state.selectedSlideId) return;
      dispatch({
        type: "updateSlide",
        slideId: state.selectedSlideId,
        updater: (slide) => {
          const newMap = { ...slide.columnMap } as typeof slide.columnMap;
          for (const board of slide.boards) {
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
                break;
              }
            }
          }
          return { ...slide, columnMap: newMap };
        },
      });
    },
    [state.selectedSlideId, dispatch]
  );

  const updateColumn = useCallback(
    (updated: ColumnType<SlideElementDnDItemProps>) => {
      if (!state.selectedSlideId) return;
      dispatch({
        type: "updateSlide",
        slideId: state.selectedSlideId,
        updater: (slide) => ({
          ...slide,
          columnMap: { ...slide.columnMap, [updated.columnId]: updated },
        }),
      });
    },
    [state.selectedSlideId, dispatch]
  );

  const updateBoard = useCallback(
    (updated: BoardRow) => {
      if (!state.selectedSlideId) return;
      dispatch({
        type: "updateBoard",
        slideId: state.selectedSlideId,
        boardId: updated.id,
        updater: () => updated,
      });
    },
    [state.selectedSlideId, dispatch]
  );

  const cloneElement = useCallback(() => {
    if (!state.selectedSlideId || !state.selectedElementId) return;
    dispatch({
      type: "updateSlide",
      slideId: state.selectedSlideId,
      updater: (slide) => {
        const newMap = { ...slide.columnMap } as typeof slide.columnMap;
        for (const board of slide.boards) {
          for (const colId of board.orderedColumnIds) {
            const col = newMap[colId];
            const idx = col.items.findIndex(
              (i) => i.id === state.selectedElementId
            );
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
              return { ...slide, columnMap: newMap };
            }
          }
        }
        return slide;
      },
    });
  }, [state.selectedSlideId, state.selectedElementId, dispatch]);

  const deleteElement = useCallback(() => {
    if (!state.selectedSlideId || !state.selectedElementId) return;
    dispatch({
      type: "updateSlide",
      slideId: state.selectedSlideId,
      updater: (slide) => {
        const newMap = { ...slide.columnMap } as typeof slide.columnMap;
        for (const board of slide.boards) {
          for (const colId of board.orderedColumnIds) {
            const col = newMap[colId];
            const idx = col.items.findIndex(
              (i) => i.id === state.selectedElementId
            );
            if (idx !== -1) {
              newMap[colId] = {
                ...col,
                items: [
                  ...col.items.slice(0, idx),
                  ...col.items.slice(idx + 1),
                ],
              };
              return { ...slide, columnMap: newMap };
            }
          }
        }
        return slide;
      },
    });
    dispatch({ type: "selectElement", id: null });
  }, [state.selectedSlideId, state.selectedElementId, dispatch]);

  const handleDropElement = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("text/plain");
      if (!state.selectedSlideId) return;
      if (!type) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const columnEl = target?.closest(
        "[data-column-id]"
      ) as HTMLElement | null;
      const dropColumnId = columnEl?.dataset.columnId;

      dispatch({
        type: "updateSlide",
        slideId: state.selectedSlideId,
        updater: (s) => {
          const newEl: SlideElementDnDItemProps = {
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
              ? {
                  src: "https://via.placeholder.com/150",
                }
              : type === "video"
              ? { url: "" }
              : type === "quiz"
              ? {
                  title: "Untitled Quiz",
                  description: "",
                  questions: [],
                }
              : {}),
            wrapperStyles: {
              bgColor: "#ffffff",
              bgOpacity: 0,
              gradientFrom: "",
              gradientTo: "",
              gradientDirection: 0,
              dropShadow: "none",
              paddingX: 0,
              paddingY: 0,
              marginX: 0,
              marginY: 0,
              borderColor: "#000000",
              borderWidth: 0,
              borderRadius: "none",
            },
          };

          const firstColumn = s.boards[0].orderedColumnIds[0];
          const columnId =
            dropColumnId && s.columnMap[dropColumnId]
              ? dropColumnId
              : firstColumn;
          const column = s.columnMap[columnId];

          let insertIndex = column.items.length;
          if (columnEl) {
            const cards = Array.from(
              columnEl.querySelectorAll("[data-card-id]")
            ) as HTMLElement[];
            for (let i = 0; i < cards.length; i++) {
              const rect = cards[i].getBoundingClientRect();
              if (e.clientY < rect.top + rect.height / 2) {
                insertIndex = i;
                break;
              }
            }
          }

          const updatedColumn = {
            ...column,
            items: [
              ...column.items.slice(0, insertIndex),
              newEl,
              ...column.items.slice(insertIndex),
            ],
          };

          return {
            ...s,
            columnMap: { ...s.columnMap, [columnId]: updatedColumn },
          };
        },
      });
      dispatch({ type: "setDropIndicator", indicator: null });
    },
    [state.selectedSlideId, dispatch]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      if (!state.selectedSlideId || !type) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const columnEl = target?.closest(
        "[data-column-id]"
      ) as HTMLElement | null;
      const dropColumnId = columnEl?.dataset.columnId;
      if (!dropColumnId) {
        dispatch({ type: "setDropIndicator", indicator: null });
        return;
      }

      const slide = state.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;
      const column = slide.columnMap[dropColumnId];
      if (!column) return;

      let insertIndex = column.items.length;
      if (columnEl) {
        const cards = Array.from(
          columnEl.querySelectorAll("[data-card-id]")
        ) as HTMLElement[];
        for (let i = 0; i < cards.length; i++) {
          const rect = cards[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            insertIndex = i;
            break;
          }
        }
      }

      dispatch({
        type: "setDropIndicator",
        indicator: { columnId: dropColumnId, index: insertIndex },
      });
    },
    [state.selectedSlideId, state.slides, dispatch]
  );

  return (
    <Box>
      <Box p={4} borderWidth="1px" borderRadius="md">
        <HStack>
          {AVAILABLE_ELEMENTS.map((el) => (
            <Box
              key={el.type}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", el.type)}
              bgColor="white"
            >
              {el.label}
            </Box>
          ))}
        </HStack>
      </Box>

      <HStack mt={2} alignItems="flex-start">
        <Select
          placeholder="Select collection"
          value={selectedCollectionId}
          onChange={(e) =>
            setSelectedCollectionId(
              e.target.value === "" ? "" : parseInt(e.target.value, 10)
            )
          }
        >
          {styleCollections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <HStack>
          {AVAILABLE_ELEMENTS.map((el) => (
            <Button key={el.type} size="sm">
              {el.label}
            </Button>
          ))}
        </HStack>
      </HStack>

      <Flex gap={6} alignItems="flex-start">
        <SlideSequencer
          slides={state.slides}
          setSlides={setSlides as any}
          selectedSlideId={state.selectedSlideId}
          onSelect={(id) => dispatch({ type: "selectSlide", id })}
        />
        {state.selectedSlideId && (
          <Grid gap={4} flex={1} templateColumns="1fr 300px">
            <Box
              flex="1"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              onDragOver={handleDragOver}
              onDragLeave={() =>
                dispatch({ type: "setDropIndicator", indicator: null })
              }
              onDrop={handleDropElement}
            >
              <Text mb={2}>Slide Elements</Text>
              <SlideElementsContainer
                columnMap={selectedSlide!.columnMap}
                boards={selectedSlide!.boards}
                onChange={(columnMap, boards) =>
                  dispatch({
                    type: "updateSlide",
                    slideId: state.selectedSlideId!,
                    updater: (s) => ({ ...s, columnMap, boards }),
                  })
                }
                selectedElementId={state.selectedElementId}
                onSelectElement={(id) =>
                  dispatch({ type: "selectElement", id })
                }
                dropIndicator={state.dropIndicator}
                selectedColumnId={state.selectedColumnId}
                onSelectColumn={(id) => dispatch({ type: "selectColumn", id })}
                selectedBoardId={state.selectedBoardId}
                onSelectBoard={(id) => dispatch({ type: "selectBoard", id })}
              />
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md" minW="200px">
              <HStack justify="space-between" mb={2}>
                <Text>Attributes</Text>
                <HStack>
                  <Button size="xs" onClick={() => setIsLoadStyleOpen(true)}>
                    Load Style
                  </Button>
                  <Button size="xs" onClick={() => setIsSaveStyleOpen(true)}>
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
      <SaveStyleModal
        isOpen={isSaveStyleOpen}
        onClose={() => setIsSaveStyleOpen(false)}
        collections={styleCollections}
        onSave={({ name, collectionId }) => {
          if (!selectedElement) return;
          createStyle({
            variables: {
              data: {
                name,
                collectionId,
                element: ELEMENT_TYPE_TO_ENUM[selectedElement.type],
                config: selectedElement,
              },
            },
          });
        }}
        onAddCollection={(collection) =>
          setStyleCollections([...styleCollections, collection])
        }
      />
      <LoadStyleModal
        isOpen={isLoadStyleOpen}
        onClose={() => setIsLoadStyleOpen(false)}
        collections={styleCollections}
        elementType={selectedElement ? ELEMENT_TYPE_TO_ENUM[selectedElement.type] : null}
        onLoad={(styleId) => {
          if (!selectedElement) return;
          // Placeholder for backend call using style module
          console.log("load style", { styleId });
        }}
      />
    </Box>
  );
});

export default LessonEditor;

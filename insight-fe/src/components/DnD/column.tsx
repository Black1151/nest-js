import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";
import { Box, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

import { useBoardContext } from "./BoardContext";
import { Card } from "./card";
import { ColumnContext, type ColumnContextProps } from "./ColumnContext";
import type { BaseCardDnD, ColumnType } from "./types";

/* ------------------------------------------------------------------ */
/*  Static style objects                                               */
/* ------------------------------------------------------------------ */
const columnBaseStyles = {
  width: "250px",
  backgroundColor: "gray.100",
  borderRadius: "md",
  position: "relative", // fixed typo
  transition: "background 200ms ease-in-out",
};

const idleStyles = { cursor: "grab" };
const cardOverStyles = { bg: "blue.50" };
const isDraggingStyles = { opacity: 0.4 };

const columnHeaderStyles = {
  px: 4,
  py: 3,
  color: "gray.500",
  userSelect: "none",
};

const scrollContainerStyles = {
  height: "100%",
  overflowY: "auto",
  py: 1,
};

const cardListStyles = {
  boxSizing: "border-box",
  minHeight: "100%",
  px: 1,
};

/* ------------------------------------------------------------------ */
/*  Local state types                                                  */
/* ------------------------------------------------------------------ */
type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface ColumnProps<TCard extends BaseCardDnD> {
  column: ColumnType<TCard>;
  CardComponent: React.ComponentType<{ item: TCard }>;
  /** Toggle whether the user can drag / reorder whole columns */
  enableColumnReorder?: boolean;
}

function ColumnBase<TCard extends BaseCardDnD>({
  column,
  CardComponent,
  enableColumnReorder = true,
}: ColumnProps<TCard>) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState(false);

  const { instanceId, registerColumn } = useBoardContext();

  /* -------------------------------------- */
  /*  DnD + auto‑scroll wiring              */
  /* -------------------------------------- */
  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(headerRef.current);
    invariant(scrollableRef.current);

    const disposables = [
      registerColumn({
        columnId,
        entry: { element: columnRef.current },
      }),
      // card‑over‑column container
      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      // column‑over‑column
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === "column",
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { columnId };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setState({
            type: "is-column-over",
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          const closestEdge = extractClosestEdge(args.self.data);
          setState((current) =>
            current.type === "is-column-over" &&
            current.closestEdge === closestEdge
              ? current
              : { type: "is-column-over", closestEdge }
          );
        },
        onDragLeave: () => setState(idle),
        onDrop: () => setState(idle),
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
      }),
    ];

    // draggable wiring only if allowed
    if (enableColumnReorder) {
      disposables.push(
        draggable({
          element: columnRef.current,
          dragHandle: headerRef.current,
          getInitialData: () => ({ columnId, type: "column", instanceId }),
          onGenerateDragPreview: ({ nativeSetDragImage }) => {
            const isSafari =
              navigator.userAgent.includes("AppleWebKit") &&
              !navigator.userAgent.includes("Chrome");

            if (!isSafari) {
              setState({ type: "generate-column-preview" });
              return;
            }
            setCustomNativeDragPreview({
              getOffset: centerUnderPointer,
              render: ({ container }) => {
                setState({
                  type: "generate-safari-column-preview",
                  container,
                });
                return () => setState(idle);
              },
              nativeSetDragImage,
            });
          },
          onDragStart: () => setIsDragging(true),
          onDrop: () => {
            setState(idle);
            setIsDragging(false);
          },
        })
      );
    }

    return combine(...disposables);
  }, [columnId, registerColumn, instanceId, enableColumnReorder]);

  /* -------------------------------------- */
  /*  Helpers shared via context            */
  /* -------------------------------------- */
  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback(
    (userId: string) =>
      stableItems.current.findIndex((item: any) => item.userId === userId),
    []
  );

  const getNumCards = useCallback(() => stableItems.current.length, []);

  const contextValue: ColumnContextProps = useMemo(
    () => ({
      columnId,
      getCardIndex,
      getNumCards,
      cardStyle: column.styles?.card,
    }),
    [columnId, getCardIndex, getNumCards, column.styles?.card]
  );

  /* -------------------------------------- */
  /*  Dynamic styles                        */
  /* -------------------------------------- */
  const combinedStyles = {
    ...columnBaseStyles,
    ...(column.styles?.container ?? {}),
    // only apply grab cursor if column reordering is enabled
    ...(state.type === "idle" && enableColumnReorder ? idleStyles : {}),
    ...(state.type === "is-card-over" ? cardOverStyles : {}),
  };

  /* -------------------------------------- */
  /*  Render                                */
  /* -------------------------------------- */
  return (
    <ColumnContext.Provider value={contextValue}>
      <Flex
        ref={columnRef}
        direction="column"
        sx={combinedStyles}
        data-testid={`column-${columnId}`}
      >
        <Stack ref={columnInnerRef} flexGrow={1} minH={0}>
          <Stack
            flexGrow={1}
            minH={0}
            overflow="hidden"
            sx={isDragging ? isDraggingStyles : undefined}
            spacing={0}
          >
            <HStack
              ref={headerRef}
              justify="space-between"
              align="center"
              sx={{ ...columnHeaderStyles, ...(column.styles?.header ?? {}) }}
              data-testid={`column-header-${columnId}`}
            >
              <Heading
                as="span"
                size="xs"
                data-testid={`column-header-title-${columnId}`}
              >
                {column.title}
              </Heading>
            </HStack>

            <Box ref={scrollableRef} sx={scrollContainerStyles}>
              <Stack
                sx={{ ...cardListStyles, ...(column.styles?.cardList ?? {}) }}
              >
                {column.items.map((item: TCard) => (
                  <Card
                    key={item.id}
                    item={item}
                    CardComponent={CardComponent}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {state.type === "is-column-over" && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap="8px" />
        )}
      </Flex>

      {state.type === "generate-safari-column-preview" &&
        createPortal(<SafariColumnPreview column={column} />, state.container)}
    </ColumnContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Public, memoised export                                            */
/* ------------------------------------------------------------------ */
export const Column = memo(ColumnBase) as <TCard extends BaseCardDnD>(
  props: ColumnProps<TCard>
) => JSX.Element;

/* ------------------------------------------------------------------ */
/*  Safari preview helper                                              */
/* ------------------------------------------------------------------ */
function SafariColumnPreview<TCard extends BaseCardDnD>({
  column,
}: {
  column: ColumnType<TCard>;
}) {
  return (
    <Box
      sx={{
        width: "250px",
        backgroundColor: "gray.100",
        borderRadius: "md",
        p: 2,
      }}
    >
      <Heading as="span" size="xs">
        {column.title}
      </Heading>
    </Box>
  );
}

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
import {
  Box,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { X, Settings } from "lucide-react";
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
import { LoadingSpinnerCard } from "../loading/LoadingSpinnerCard";

// Helper to convert hex colors with optional opacity
const hexToRgba = (hex: string, opacity: number) => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ------------------------------------------------------------------
//  Static style objects
// ------------------------------------------------------------------
const columnBaseStyles = {
  width: "100%",
  backgroundColor: "transparent",
  borderRadius: "md",
  position: "relative",
  transition: "background 200ms ease-in-out",
  flex: 1,
  overflowY: "auto",
  borderWidth: "1px",
  borderStyle: "dashed",
  borderColor: "gray.300",
};

const idleStyles = { cursor: "grab" };
const cardOverStyles = { bg: "blue.50" };
const isDraggingStyles = { opacity: 0.4 };


const scrollContainerStyles = {
  height: "100%",
  overflowY: "auto",
  py: 1,
  flex: 1,
  minH: 0,
};

const cardListStyles = {
  boxSizing: "border-box",
  minHeight: "100%",
  px: 1,
  overflowY: "auto",
};

// ------------------------------------------------------------------
//  Local state type
// ------------------------------------------------------------------
type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

// ------------------------------------------------------------------
//  Component
// ------------------------------------------------------------------
interface ColumnProps<TCard extends BaseCardDnD> {
  column: ColumnType<TCard>;
  CardComponent: React.ComponentType<{ item: TCard }>;
  /** Toggle whether the user can drag / reorder whole columns */
  enableColumnReorder?: boolean;
  isLoading?: boolean;
  onRemoveColumn?: (columnId: string) => void;
  /** Optional index to display an external drop indicator */
  externalDropIndex?: number | null;
  onSelectColumn?: (columnId: string) => void;
  isSelected?: boolean;
}

function ColumnBase<TCard extends BaseCardDnD>({
  column,
  CardComponent,
  enableColumnReorder = true,
  isLoading = false,
  onRemoveColumn,
  externalDropIndex = null,
  onSelectColumn,
  isSelected = false,
}: ColumnProps<TCard>) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState(false);

  const { instanceId, registerColumn } = useBoardContext();

  // --------------------------------------
  //  DnD + auto‑scroll wiring
  // --------------------------------------
  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
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

    // If column reordering is enabled, make the column draggable.
    if (enableColumnReorder) {
      disposables.push(
        draggable({
          element: columnRef.current,
          dragHandle: columnRef.current,
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

  // --------------------------------------
  //  Helpers shared via context
  // --------------------------------------
  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback(
    (id: string) =>
      stableItems.current.findIndex((item: TCard) => item.id === id),
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

  // --------------------------------------
  //  Sorting logic
  // --------------------------------------
  const { sortBy, sortDirection } = column;

  const sortedItems = useMemo(() => {
    // If no sort function or the direction is "none", use raw order
    if (!sortBy || sortDirection === "none" || !sortDirection) {
      return column.items;
    }

    const itemsCopy = [...column.items];
    itemsCopy.sort((a, b) => {
      const aVal = sortBy(a) ?? "";
      const bVal = sortBy(b) ?? "";
      // Cast to string safely. If numeric sorting is needed, parse floats or integers instead.
      return String(aVal).localeCompare(String(bVal));
    });

    if (sortDirection === "desc") {
      itemsCopy.reverse();
    }

    return itemsCopy;
  }, [column.items, sortBy, sortDirection]);

  // --------------------------------------
  //  Dynamic styles
  // --------------------------------------
  const combinedStyles = {
    ...columnBaseStyles,
    ...(column.wrapperStyles
      ? {
          bg:
            column.wrapperStyles.gradientFrom && column.wrapperStyles.gradientTo
              ? `linear-gradient(${
                  column.wrapperStyles.gradientDirection ?? 0
                }deg, ${column.wrapperStyles.gradientFrom}, ${
                  column.wrapperStyles.gradientTo
                })`
              : column.wrapperStyles.bgColor
              ? hexToRgba(
                  column.wrapperStyles.bgColor,
                  column.wrapperStyles.bgOpacity ?? 0
                )
              : undefined,
          boxShadow: column.wrapperStyles.dropShadow,
          px: column.wrapperStyles.paddingX,
          py: column.wrapperStyles.paddingY,
          mx: column.wrapperStyles.marginX,
          my: column.wrapperStyles.marginY,
          borderColor: column.wrapperStyles.borderColor,
          borderWidth: column.wrapperStyles.borderWidth,
          borderRadius: column.wrapperStyles.borderRadius,
        }
      : {}),
    ...(column.styles?.container ?? {}),
    // only apply grab cursor if column reordering is enabled
    ...(state.type === "idle" && enableColumnReorder ? idleStyles : {}),
    ...(state.type === "is-card-over" ? cardOverStyles : {}),
    ...(isSelected ? { borderColor: "blue.400", borderWidth: 2 } : {}),
  };

  // --------------------------------------
  //  Render
  // --------------------------------------
  return (
    <ColumnContext.Provider value={contextValue}>
      <Flex
        ref={columnRef}
        direction="column"
        sx={combinedStyles}
        data-testid={`column-${columnId}`}
        data-column-id={columnId}
      >
        <Stack ref={columnInnerRef} flexGrow={1} minH={0}>
          <Stack
            flexGrow={1}
            overflow="hidden"
            sx={isDragging ? isDraggingStyles : undefined}
            spacing={0}
            height="100%"
          >
            <HStack
              ref={headerRef}
              position="absolute"
              top={1}
              right={1}
              spacing={1}
              zIndex={1}
            >
              {onSelectColumn && (
                <IconButton
                  aria-label="Edit column styles"
                  icon={<Settings size={12} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => onSelectColumn(columnId)}
                />
              )}
              {onRemoveColumn && (
                <IconButton
                  aria-label="Remove column"
                  icon={<X size={12} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => onRemoveColumn(columnId)}
                />
              )}
            </HStack>

            <Box ref={scrollableRef} sx={scrollContainerStyles}>
              <Stack
                flexGrow={1}
                sx={{ ...cardListStyles, ...(column.styles?.cardList ?? {}) }}
                spacing={column.spacing ?? 2}
              >
                {isLoading ? (
                  <LoadingSpinnerCard />
                ) : (
                  /** Render sorted or raw items: */
                  sortedItems.map((item: TCard, idx: number) => (
                    <React.Fragment key={item.id}>
                      {externalDropIndex === idx && (
                        <DropIndicator edge="top" gap="0.5rem" />
                      )}
                      <Card item={item} CardComponent={CardComponent} />
                    </React.Fragment>
                  ))
                )}
                {externalDropIndex === sortedItems.length && (
                  <DropIndicator edge="bottom" gap="0.5rem" />
                )}
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

// ------------------------------------------------------------------
//  Safari preview helper
// ------------------------------------------------------------------
function SafariColumnPreview<TCard extends BaseCardDnD>({
  column,
}: {
  column: ColumnType<TCard>;
}) {
  return (
    <Box
      sx={{
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

// ------------------------------------------------------------------
//  Export a memoized version
// ------------------------------------------------------------------
export const Column = memo(ColumnBase) as <TCard extends BaseCardDnD>(
  props: ColumnProps<TCard>
) => JSX.Element;

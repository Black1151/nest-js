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

// Chakra UI components
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  HStack,
} from "@chakra-ui/react";

// If you need to merge refs, you can use react-merge-refs or your own utility
// import mergeRefs from 'react-merge-refs';

// Drag-and-drop imports remain from Atlassian's pragmatic-drag-and-drop libraries
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

// Types and context from your own code
import { type ColumnType } from "./data/people";
import { useBoardContext } from "./BoardContext";
import { Card } from "./card";
import {
  ColumnContext,
  type ColumnContextProps,
  useColumnContext,
} from "./ColumnContext";

import { Ellipsis } from "lucide-react";

// ------------------------------------------------------------------
// Some style objects using Chakra’s style props / sx syntax
// ------------------------------------------------------------------

const columnBaseStyles = {
  width: "250px",
  backgroundColor: "gray.100",
  borderRadius: "md",
  position: "relative",
  // Mimic a background transition
  transition: "background 200ms ease-in-out",
};

const idleStyles = {
  cursor: "grab",
};

const cardOverStyles = {
  bg: "blue.50",
};

const isDraggingStyles = {
  opacity: 0.4,
};

const columnHeaderStyles = {
  px: 2,
  pt: 1,
  color: "gray.500",
  userSelect: "none",
};

const scrollContainerStyles = {
  height: "100%",
  overflowY: "auto",
};

const cardListStyles = {
  boxSizing: "border-box",
  minHeight: "100%",
  p: 2,
  gap: 2,
};

type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

// Preventing re-renders with stable state objects
const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(headerRef.current);
    invariant(scrollableRef.current);

    return combine(
      registerColumn({
        columnId,
        entry: {
          element: columnRef.current,
        },
      }),
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
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop() {
          setState(idle);
          setIsDragging(false);
        },
      }),
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
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (
              current.type === "is-column-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return {
              type: "is-column-over",
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
      })
    );
  }, [columnId, registerColumn, instanceId]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback((userId: string) => {
    return stableItems.current.findIndex((item: any) => item.userId === userId);
  }, []);

  const getNumCards = useCallback(() => {
    return stableItems.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  // Determine styles based on state
  const combinedStyles = {
    ...columnBaseStyles,
    ...(state.type === "idle" ? idleStyles : {}),
    ...(state.type === "is-card-over" ? cardOverStyles : {}),
  };

  return (
    <ColumnContext.Provider value={contextValue}>
      <Flex
        data-testid={`column-${columnId}`}
        ref={columnRef}
        direction="column"
        sx={combinedStyles}
      >
        <Stack
          ref={columnInnerRef}
          flexGrow={1}
          minH={0}
          // This outer Stack is a container for the column's inner content
        >
          <Stack
            // The inner Stack for heading + card list
            flexGrow={1}
            sx={isDragging ? isDraggingStyles : undefined}
          >
            <HStack
              data-testid={`column-header-${columnId}`}
              ref={headerRef}
              justify="space-between"
              align="center"
              sx={columnHeaderStyles}
            >
              <Heading
                as="span"
                size="xs"
                data-testid={`column-header-title-${columnId}`}
              >
                {column.title}
              </Heading>
              <ActionMenu />
            </HStack>

            <Box ref={scrollableRef} sx={scrollContainerStyles}>
              <Stack sx={cardListStyles}>
                {column.items.map((item: any, index: number) => (
                  <Card item={item} key={index} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>
        {state.type === "is-column-over" && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap="8px" />
        )}
      </Flex>

      {state.type === "generate-safari-column-preview"
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
        : null}
    </ColumnContext.Provider>
  );
});

function SafariColumnPreview({ column }: { column: ColumnType }) {
  // Simple styling for the Safari fallback
  const safariPreviewStyles = {
    width: "250px",
    backgroundColor: "gray.100",
    borderRadius: "md",
    p: 2,
  };

  return (
    <Box sx={safariPreviewStyles}>
      <Heading as="span" size="xs">
        {column.title}
      </Heading>
    </Box>
  );
}

function ActionMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Actions"
        size="sm"
        variant="ghost"
        icon={<Ellipsis />}
      />
      <MenuList>
        <ActionMenuItems />
      </MenuList>
    </Menu>
  );
}

function ActionMenuItems() {
  const { columnId } = useColumnContext();
  const { getColumns, reorderColumn } = useBoardContext();

  const columns = getColumns();
  const startIndex = columns.findIndex((col: any) => col.columnId === columnId);

  const moveLeft = useCallback(() => {
    reorderColumn({
      startIndex,
      finishIndex: startIndex - 1,
    });
  }, [reorderColumn, startIndex]);

  const moveRight = useCallback(() => {
    reorderColumn({
      startIndex,
      finishIndex: startIndex + 1,
    });
  }, [reorderColumn, startIndex]);

  const isMoveLeftDisabled = startIndex === 0;
  const isMoveRightDisabled = startIndex === columns.length - 1;

  return (
    <>
      <MenuItem onClick={moveLeft} isDisabled={isMoveLeftDisabled}>
        Move left
      </MenuItem>
      <MenuItem onClick={moveRight} isDisabled={isMoveRightDisabled}>
        Move right
      </MenuItem>
    </>
  );
}

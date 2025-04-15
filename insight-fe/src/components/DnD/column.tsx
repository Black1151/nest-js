"use client";

import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { memo, useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { Card, CardShadow } from "./card";
import {
  getColumnData,
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TCardData,
  TColumn,
  blockBoardPanningAttr,
} from "./data";
import { isSafari } from "./isSafari";
import { isShallowEqual } from "./is-shallow-equal";
import { SettingsContext } from "./settings-context";
import { Copy, Ellipsis, Plus } from "lucide-react";

/**
 * Represents the different states this Column can be in.
 */
type TColumnState =
  | {
      type: "is-card-over";
      isOverChildCard: boolean;
      dragging: DOMRect;
    }
  | {
      type: "is-column-over";
    }
  | {
      type: "idle";
    }
  | {
      type: "is-dragging";
    };

const idleState: TColumnState = { type: "idle" };

const stateStyles: Record<TColumnState["type"], any> = {
  idle: { cursor: "grab" },
  "is-card-over": {
    outline: "2px solid",
    outlineColor: "gray.100",
  },
  "is-dragging": {
    opacity: 0.4,
  },
  "is-column-over": {
    bg: "gray.900",
  },
};

/**
 * A memoized component for rendering out the column's cards
 */
const CardList = memo(function CardList({ column }: { column: TColumn }) {
  return (
    <>
      {column.cards.map((card) => (
        <Card key={card.id} card={card} columnId={column.id} />
      ))}
    </>
  );
});

export function Column({ column }: { column: TColumn }) {
  const { settings } = useContext(SettingsContext);
  const [state, setState] = useState<TColumnState>(idleState);

  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const scrollable = scrollableRef.current;
    const header = headerRef.current;
    const inner = innerRef.current;
    invariant(outer && scrollable && header && inner);

    const data = getColumnData({ column });

    function setIsCardOver({
      data,
      location,
    }: {
      data: TCardData;
      location: any;
    }) {
      const innerMost = location.current.dropTargets[0];
      const isOverChildCard = !!(
        innerMost && isCardDropTargetData(innerMost.data)
      );

      const proposed: TColumnState = {
        type: "is-card-over",
        dragging: data.rect,
        isOverChildCard,
      };

      setState((current) => {
        if (isShallowEqual(proposed, current)) {
          return current;
        }
        return proposed;
      });
    }

    return combine(
      // Make the column header draggable
      draggable({
        element: header,
        getInitialData: () => data,
        onGenerateDragPreview({ source, location, nativeSetDragImage }) {
          const colData = source.data;
          if (!isColumnData(colData)) return;

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: header,
              input: location.current.input,
            }),
            render({ container }) {
              const rect = inner.getBoundingClientRect();
              const preview = inner.cloneNode(true) as HTMLElement;

              preview.style.width = `${rect.width}px`;
              preview.style.height = `${rect.height}px`;
              if (!isSafari()) {
                preview.style.transform = "rotate(4deg)";
              }
              container.appendChild(preview);
            },
          });
        },
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idleState);
        },
      }),
      // Drop target that can accept either cards or columns
      dropTargetForElements({
        element: outer,
        getData: () => data,
        canDrop({ source }) {
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getIsSticky: () => true,
        onDragStart({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },
        onDragEnter({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
            return;
          }
          if (
            isColumnData(source.data) &&
            source.data.column.id !== column.id
          ) {
            setState({ type: "is-column-over" });
          }
        },
        onDropTargetChange({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },
        onDragLeave({ source }) {
          if (
            isColumnData(source.data) &&
            source.data.column.id === column.id
          ) {
            return;
          }
          setState(idleState);
        },
        onDrop() {
          setState(idleState);
        },
      }),
      // Auto-scroll on the column (vertical)
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) return false;
          return isDraggingACard({ source });
        },
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        element: scrollable,
      }),
      // Overflow auto-scroll on the column
      unsafeOverflowAutoScrollForElements({
        element: scrollable,
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) return false;
          if (!settings.isOverflowScrollingEnabled) return false;
          return isDraggingACard({ source });
        },
        getOverflow() {
          return {
            forTopEdge: { top: 1000 },
            forBottomEdge: { bottom: 1000 },
          };
        },
      })
    );
  }, [column, settings]);

  const currentStyle = stateStyles[state.type] || {};

  return (
    <Flex
      ref={outerFullHeightRef}
      width="18rem" // ~ Tailwind w-72 is 18rem
      flexShrink={0}
      userSelect="none"
      flexDir="column"
    >
      <Flex
        ref={innerRef}
        flexDir="column"
        borderRadius="lg"
        bg="gray.800"
        color="gray.50"
        {...currentStyle}
        // This attribute is used to avoid the board panning when pointerdown
        {...{ [blockBoardPanningAttr]: true }}
      >
        {/* Only hide content if this column is currently being hovered by another column */}
        <Box
          display={state.type === "is-column-over" ? "none" : "flex"}
          flexDir="column"
          maxH="100%"
        >
          {/* Header */}
          <Flex
            ref={headerRef}
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            px={3}
            pt={3}
            pb={2}
          >
            <Box pl={2} fontWeight="bold" fontSize="sm" lineHeight="short">
              {column.title}
            </Box>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="More actions"
              icon={<Ellipsis size={16} />}
            />
          </Flex>

          {/* Cards container */}
          <Box
            ref={scrollableRef}
            display="flex"
            flexDir="column"
            overflowY="auto"
            maxH="calc(100vh - 150px)" // arbitrary, adapt as needed
          >
            <CardList column={column} />
            {/* Insert a card shadow if the card is not over a child card */}
            {state.type === "is-card-over" && !state.isOverChildCard && (
              <Box px={3} py={1} flexShrink={0}>
                <CardShadow dragging={state.dragging} />
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Flex flexDir="row" gap={2} p={3}>
            <Button
              variant="ghost"
              size="sm"
              flex="1"
              leftIcon={<Plus size={16} />}
            >
              Add a card
            </Button>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="Create card from template"
              icon={<Copy size={16} />}
            />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

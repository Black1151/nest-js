"use client";

import { Box, Flex } from "@chakra-ui/react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { createPortal } from "react-dom";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

import {
  getCardData,
  getCardDropTargetData,
  isCardData,
  isDraggingACard,
  TCard,
} from "./data";
import { isSafari } from "./isSafari";
import { isShallowEqual } from "./is-shallow-equal";

/**
 * Represents the different states this Card can be in.
 */
type TCardState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-dragging-and-left-self" }
  | { type: "is-over"; dragging: DOMRect; closestEdge: Edge }
  | { type: "preview"; container: HTMLElement; dragging: DOMRect };

const idleState: TCardState = { type: "idle" };

/**
 * Styles that apply to the INNER element (the draggable Box).
 * We must have an entry for each TCardState["type"] to satisfy the Record type.
 */
const innerStyles: Record<TCardState["type"], any> = {
  idle: {
    cursor: "grab",
    _hover: { outline: "2px solid", outlineColor: "gray.50" },
  },
  "is-dragging": { opacity: 0.4 },
  "is-dragging-and-left-self": {}, // no special style
  "is-over": {}, // no special style
  preview: {}, // no special style
};

/**
 * Styles that apply to the OUTER element (the flex wrapper).
 * Likewise must have an entry for each TCardState["type"].
 */
const outerStyles: Record<TCardState["type"], any> = {
  idle: {},
  "is-dragging": {},
  "is-dragging-and-left-self": { display: "none" },
  "is-over": {},
  preview: {},
};

export function CardShadow({ dragging }: { dragging: DOMRect }) {
  return (
    <Box
      flexShrink={0}
      borderRadius="md"
      bg="gray.900"
      height={`${dragging.height}px`}
    />
  );
}

export function CardDisplay({
  card,
  state,
  outerRef,
  innerRef,
}: {
  card: TCard;
  state: TCardState;
  outerRef?: MutableRefObject<HTMLDivElement | null>;
  innerRef?: MutableRefObject<HTMLDivElement | null>;
}) {
  const outerStyle = outerStyles[state.type] || {};
  const innerStyle = innerStyles[state.type] || {};
  const transformStyle =
    state.type === "preview" && !isSafari() ? "rotate(4deg)" : undefined;

  return (
    <Flex
      ref={outerRef}
      flexDir="column"
      flexShrink={0}
      gap={2}
      px={3}
      py={1}
      {...outerStyle}
    >
      {/* Put a shadow above the item if we are closest to the 'top' edge */}
      {state.type === "is-over" && state.closestEdge === "top" && (
        <CardShadow dragging={state.dragging} />
      )}

      <Box
        ref={innerRef}
        borderRadius="md"
        bg="gray.700"
        color="gray.300"
        p={2}
        style={
          state.type === "preview"
            ? {
                width: `${state.dragging.width}px`,
                height: `${state.dragging.height}px`,
                transform: transformStyle,
              }
            : {}
        }
        {...innerStyle}
      >
        {card.description}
      </Box>

      {/* Put a shadow below the item if we are closest to the 'bottom' edge */}
      {state.type === "is-over" && state.closestEdge === "bottom" && (
        <CardShadow dragging={state.dragging} />
      )}
    </Flex>
  );
}

export function Card({ card, columnId }: { card: TCard; columnId: string }) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TCardState>(idleState);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    invariant(outer && inner);

    return combine(
      draggable({
        element: inner,
        getInitialData: ({ element }) =>
          getCardData({
            card,
            columnId,
            rect: element.getBoundingClientRect(),
          }),
        onGenerateDragPreview({ nativeSetDragImage, location, source }) {
          const data = source.data;
          if (!isCardData(data)) return;

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: inner,
              input: location.current.input,
            }),
            render({ container }) {
              setState({
                type: "preview",
                container,
                dragging: inner.getBoundingClientRect(),
              });
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
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop: isDraggingACard,
        getData: ({ element, input }) => {
          const data = getCardDropTargetData({ card, columnId });
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter({ source, self }) {
          if (!isCardData(source.data)) return;
          // If it's the same card, we don't handle
          if (source.data.card.id === card.id) return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          setState({
            type: "is-over",
            dragging: source.data.rect,
            closestEdge,
          });
        },
        onDrag({ source, self }) {
          if (!isCardData(source.data)) return;
          if (source.data.card.id === card.id) return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          const proposedState: TCardState = {
            type: "is-over",
            dragging: source.data.rect,
            closestEdge,
          };
          setState((current) =>
            isShallowEqual(proposedState, current) ? current : proposedState
          );
        },
        onDragLeave({ source }) {
          if (!isCardData(source.data)) return;
          // The card being dragged just left itself
          if (source.data.card.id === card.id) {
            setState({ type: "is-dragging-and-left-self" });
            return;
          }
          setState(idleState);
        },
        onDrop() {
          setState(idleState);
        },
      })
    );
  }, [card, columnId]);

  return (
    <>
      <CardDisplay
        outerRef={outerRef}
        innerRef={innerRef}
        state={state}
        card={card}
      />
      {state.type === "preview" &&
        createPortal(
          <CardDisplay state={state} card={card} />,
          state.container
        )}
    </>
  );
}

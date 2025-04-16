import React, { Fragment, memo, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import invariant from "tiny-invariant";

import { Box, useMergeRefs } from "@chakra-ui/react";

// You can replace the below icons with whatever best suits your needs.
// For a "more" icon, you might use the HamburgerIcon or any other from @chakra-ui/icons.
// import { HamburgerIcon } from "@chakra-ui/icons";

import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { useBoardContext } from "./BoardContext";
import { Person } from "./data/people";

import { CardPrimitive } from "./card-primitive";

// -----------------------------------------------------------------------------
// Types and context stubs (replace these with your actual definitions)
// -----------------------------------------------------------------------------
// import { type ColumnType, type Person } from '../../data/people';
// import { useBoardContext } from './board-context';
// import { useColumnContext } from './column-context';
// -----------------------------------------------------------------------------

export type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

export const idleState: State = { type: "idle" };
export const draggingState: State = { type: "dragging" };

export const getStateStyle = (state: State["type"]) => {
  switch (state) {
    case "idle":
      return {
        cursor: "grab",
        boxShadow: "md",
        opacity: 1,
      };
    case "dragging":
      return {
        opacity: 0.4,
        boxShadow: "md",
      };
    case "preview":
      // No shadow for preview, the browser drag image handles that.
      return {};
    default:
      return {};
  }
};

// -----------------------------------------------------------------------------
// Main Card component
// -----------------------------------------------------------------------------
export const Card = memo(function Card({ item }: { item: Person }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { userId } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);

  const { instanceId, registerCard } = useBoardContext();
  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);

    return registerCard({
      cardId: userId,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current,
      },
    });
  }, [registerCard, userId]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element: element,
        getInitialData: () => ({ type: "card", itemId: userId, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setState({ type: "preview", container, rect });
              return () => setState(draggingState);
            },
          });
        },
        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForExternal({
        element: element,
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element: targetEl }) => {
          const data = { type: "card", itemId: userId };
          return attachClosestEdge(data, {
            input,
            element: targetEl,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== userId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== userId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [instanceId, item, userId]);

  // Merge the card ref with Chakra's ref (if needed). Alternatively, you can
  // just use ref directly if you don't have multiple references to merge.
  const mergedRefs = useMergeRefs(ref);

  return (
    <Fragment>
      <CardPrimitive
        ref={mergedRefs}
        item={item}
        state={state}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />
      {state.type === "preview" &&
        ReactDOM.createPortal(
          <Box
            boxSizing="border-box"
            width={`${state.rect.width}px`}
            height={`${state.rect.height}px`}
          >
            <CardPrimitive item={item} state={state} closestEdge={null} />
          </Box>,
          state.container
        )}
    </Fragment>
  );
});

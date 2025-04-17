import React, { Fragment, memo, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import invariant from "tiny-invariant";
import { Box, useMergeRefs } from "@chakra-ui/react";
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
import { CardPrimitive } from "./card-primitive";
import { BaseCardDnD, draggingState, idleState, State } from "./types";

interface CardProps<TCard extends BaseCardDnD> {
  item: TCard;
  CardComponent: React.ComponentType<{ item: TCard }>;
}

/**
 * 1) Define a base (generic) component without memo().
 */
function CardBase<TCard extends BaseCardDnD>({
  item,
  CardComponent,
}: CardProps<TCard>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const { instanceId, registerCard } = useBoardContext();
  const { id: cardId } = item;

  useEffect(() => {
    invariant(ref.current);
    return registerCard({
      cardId: item.id,
      entry: {
        element: ref.current,
      },
    });
  }, [registerCard, cardId, item.id]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "card", itemId: cardId, instanceId }),
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
        element,
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
        getIsSticky: () => true,
        getData: ({ input, element: targetEl }) => {
          // Attach info about which edge was dropped on
          const data = { type: "card", itemId: cardId };
          return attachClosestEdge(data, {
            input,
            element: targetEl,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== cardId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== cardId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [instanceId, cardId]);

  // Merge the refs if using Chakra UI’s `useMergeRefs`
  const mergedRefs = useMergeRefs(ref);

  return (
    <Fragment>
      <CardPrimitive
        ref={mergedRefs}
        item={item}
        state={state}
        closestEdge={closestEdge}
        CardComponent={CardComponent}
      />
      {state.type === "preview" &&
        ReactDOM.createPortal(
          <Box
            boxSizing="border-box"
            width={`${state.rect.width}px`}
            height={`${state.rect.height}px`}
          >
            <CardPrimitive
              item={item}
              state={state}
              closestEdge={null}
              CardComponent={CardComponent}
            />
          </Box>,
          state.container
        )}
    </Fragment>
  );
}

/**
 * 2) Export a memoized version with type assertion
 */
export const Card = memo(CardBase) as <TCard extends BaseCardDnD>(
  props: CardProps<TCard>
) => JSX.Element;

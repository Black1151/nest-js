import React, {
  forwardRef,
  Fragment,
  memo,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import invariant from "tiny-invariant";

import {
  Avatar,
  Box,
  Divider,
  Grid,
  Heading,
  Menu,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useMergeRefs,
} from "@chakra-ui/react";

// You can replace the below icons with whatever best suits your needs.
// For a "more" icon, you might use the HamburgerIcon or any other from @chakra-ui/icons.
// import { HamburgerIcon } from "@chakra-ui/icons";

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
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { useBoardContext } from "./BoardContext";
import { ColumnType, Person } from "./data/people";
import { useColumnContext } from "./ColumnContext";
import { Menu as MenuIcon } from "lucide-react";

// -----------------------------------------------------------------------------
// Types and context stubs (replace these with your actual definitions)
// -----------------------------------------------------------------------------
// import { type ColumnType, type Person } from '../../data/people';
// import { useBoardContext } from './board-context';
// import { useColumnContext } from './column-context';
// -----------------------------------------------------------------------------

type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

const idleState: State = { type: "idle" };
const draggingState: State = { type: "dragging" };

const getStateStyle = (state: State["type"]) => {
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
// Dropdown items for moving a card to another column
// -----------------------------------------------------------------------------
function MoveToOtherColumnItem({
  targetColumn,
  startIndex,
}: {
  targetColumn: ColumnType;
  startIndex: number;
}) {
  const { moveCard } = useBoardContext();
  const { columnId } = useColumnContext();

  const onClick = useCallback(() => {
    moveCard({
      startColumnId: columnId,
      finishColumnId: targetColumn.columnId,
      itemIndexInStartColumn: startIndex,
    });
  }, [columnId, moveCard, startIndex, targetColumn.columnId]);

  return <MenuItem onClick={onClick}>{targetColumn.title}</MenuItem>;
}

// -----------------------------------------------------------------------------
// CardPrimitive
// -----------------------------------------------------------------------------
type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: Person;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
};

export const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive(
    { closestEdge, item, state, actionMenuTriggerRef },
    ref
  ) {
    const { avatarUrl, name, role, userId } = item;
    const stateStyleProps = getStateStyle(state.type);

    return (
      <Grid
        ref={ref}
        data-testid={`item-${userId}`}
        templateColumns="auto 1fr auto"
        alignItems="center"
        gap={4}
        bg="white"
        p={4}
        borderRadius="md"
        position="relative"
        _hover={{ bg: "gray.100" }}
        {...stateStyleProps}
      >
        {/* Avatar */}
        <Box pointerEvents="none">
          <Avatar size="lg" name={name} src={avatarUrl} />
        </Box>

        {/* Name and role */}
        <VStack spacing={1} align="start">
          <Heading as="span" size="xs">
            {name}
          </Heading>
          <Text fontSize="sm" m={0}>
            {role}
          </Text>
        </VStack>

        {/* Menu button */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MenuIcon />}
            aria-label={`Move ${name}`}
            variant="ghost"
            size="sm"
            ref={actionMenuTriggerRef}
          />
        </Menu>

        {/* Drop indicator if needed */}
        {closestEdge && <DropIndicator edge={closestEdge} gap="0.5rem" />}
      </Grid>
    );
  }
);

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

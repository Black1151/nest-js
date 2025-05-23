// card-primitive.tsx
import React from "react";
import { Flex, Grid, SystemStyleObject } from "@chakra-ui/react";
import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { BaseCardDnD, State, getStateStyle } from "./types";
import { useColumnContext } from "./ColumnContext";

export interface CardPrimitiveProps<TCard extends BaseCardDnD> {
  closestEdge: Edge | null;
  item: TCard;
  state: State;
  CardComponent: React.ComponentType<{ item: TCard }>;
}

function InnerCardPrimitive<TCard extends BaseCardDnD>(
  { closestEdge, item, state, CardComponent }: CardPrimitiveProps<TCard>,
  ref: React.Ref<HTMLDivElement>
) {
  const stateStyleProps = getStateStyle(state.type);
  const { cardStyle } = useColumnContext();

  // merge once, column style wins
  const mergedSx: SystemStyleObject = {
    ...stateStyleProps,
    ...cardStyle,
  };

  return (
    <Grid
      ref={ref}
      data-testid={`item-${item.id}`}
      data-card-id={item.id}
      templateColumns="1fr"
      position="relative"
      sx={mergedSx}
    >
      <CardComponent item={item} />
      {closestEdge && <DropIndicator edge={closestEdge} gap="0.5rem" />}
    </Grid>
  );
}

// forwardRef can’t be generic directly, so we do the cast trick:
export const CardPrimitive = React.forwardRef(InnerCardPrimitive) as <
  TCard extends BaseCardDnD
>(
  props: CardPrimitiveProps<TCard> & React.RefAttributes<HTMLDivElement>
) => JSX.Element;

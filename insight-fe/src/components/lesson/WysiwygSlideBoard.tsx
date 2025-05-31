"use client";

import SlideElementsContainer from "./SlideElementsContainer";
import SlideElementRenderer from "./SlideElementRenderer";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import React from "react";

export default function WysiwygSlideBoard(
  props: Omit<React.ComponentProps<typeof SlideElementsContainer>, "CardComponent">
) {
  return <SlideElementsContainer {...props} CardComponent={SlideElementRenderer as React.ComponentType<{item: SlideElementDnDItemProps; onSelect?: () => void; isSelected?: boolean; onChange?: (item: SlideElementDnDItemProps) => void;}>} />;
}

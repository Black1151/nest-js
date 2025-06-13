"use client";

import DnDPalette from "@/components/DnD/DnDPalette";
import {
  SlideElementDnDItemProps,
} from "@/components/DnD/cards/SlideElementDnDCard";
import BaseElementDnDItem from "@/components/DnD/cards/BaseElementDnDCard";

const baseItems: SlideElementDnDItemProps[] = [
  { id: "base-text", type: "text" },
  { id: "base-row", type: "row" },
  { id: "base-column", type: "column" },
  {
    id: "base-table",
    type: "table",
    table: {
      rows: 2,
      cols: 2,
      cells: Array.from({ length: 2 }, () =>
        Array.from({ length: 2 }, () => ({ text: "Cell" }))
      ),
    },
  },
  { id: "base-image", type: "image", src: "https://via.placeholder.com/150" },
  { id: "base-video", type: "video", url: "" },
  { id: "base-quiz", type: "quiz", title: "Quiz", description: "", questions: [] },
];

export default function BaseElementsPalette() {
  return (
    <DnDPalette
      testId="base"
      items={baseItems}
      ItemComponent={BaseElementDnDItem}
      getDragData={(item) => JSON.stringify({ type: item.type })}
    />
  );
}

"use client";

import DnDPalette from "@/components/DnD/DnDPalette";
import {
  SlideElementDnDItemProps,
  SlideElementDnDItem,
} from "@/components/DnD/cards/SlideElementDnDCard";

const baseItems: SlideElementDnDItemProps[] = [
  { id: "base-text", type: "text" },
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
      ItemComponent={SlideElementDnDItem}
      getDragData={(item) => JSON.stringify({ type: item.type })}
    />
  );
}

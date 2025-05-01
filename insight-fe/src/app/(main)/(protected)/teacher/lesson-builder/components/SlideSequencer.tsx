"use client";

import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

import {
  DnDBoardSequencer,
  SlideData,
} from "@/components/DnD/board-sequencer/DnDBoardSequencerOLd";

import { BaseCardDnD, ColumnMap } from "@/components/DnD/types";

// ---------------------------------------------------
// 1) Define a minimal interface for your card data
// ---------------------------------------------------
interface SimpleCardData extends BaseCardDnD {
  title: string;
}

// ---------------------------------------------------
// 2) A super-simple Card component
// ---------------------------------------------------
function SimpleCard({ item }: { item: SimpleCardData }) {
  return (
    <Box
      padding="8px"
      marginBottom="4px"
      backgroundColor="gray.200"
      borderRadius="md"
    >
      {item.title}
    </Box>
  );
}

// ---------------------------------------------------
// Sample function to generate column data with some
// placeholder SimpleCardData items
// ---------------------------------------------------
function makeColumnData(
  columnTitle: string,
  columnId: string
): ColumnMap<SimpleCardData> {
  return {
    [columnId]: {
      columnId,
      title: columnTitle,
      items: [
        { id: `${columnId}-item1`, title: `${columnTitle} - Card 1` },
        { id: `${columnId}-item2`, title: `${columnTitle} - Card 2` },
      ],
    },
  };
}

// ---------------------------------------------------
// 3) The main sample page
// ---------------------------------------------------
export default function SampleSlidesPage() {
  // We'll store an array of SlideData<SimpleCardData> in state
  const [slides, setSlides] = useState<SlideData<SimpleCardData>[]>(() => [
    {
      slideId: "slide-1",
      title: "Intro Slide",
      boardData: {
        columnMap: makeColumnData("Welcome Column", "col-1"),
        orderedColumnIds: ["col-1"],
      },
    },
    {
      slideId: "slide-2",
      title: "Main Slide",
      boardData: {
        columnMap: makeColumnData("Main Column", "col-2"),
        orderedColumnIds: ["col-2"],
      },
    },
    {
      slideId: "slide-3",
      title: "Summary Slide",
      boardData: {
        columnMap: makeColumnData("Summary Column", "col-3"),
        orderedColumnIds: ["col-3"],
      },
    },
  ]);

  // Called whenever the user reorders slides and clicks "Submit"
  function handleSubmit(orderedSlides: SlideData<SimpleCardData>[]) {
    console.log("User reordered slides:", orderedSlides);
    setSlides(orderedSlides);
  }

  return (
    <Box padding="2rem">
      {/* 
        4) Render DnDBoardSequencer, passing:
           - slides array
           - a simple card component for the child board(s)
           - an onSubmit callback
           - optional showSubmitButton
      */}
      <DnDBoardSequencer
        slides={slides}
        CardComponent={SimpleCard} // <— HERE IS THE CARD
        onSubmit={handleSubmit}
        showSubmitButton
      />
    </Box>
  );
}

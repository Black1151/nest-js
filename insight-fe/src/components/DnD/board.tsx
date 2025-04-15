"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

import {
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TBoard,
  TColumn,
} from "./data";
import { SettingsContext } from "./settings-context";
import { blockBoardPanningAttr } from "./data";
import { bindAll } from "bind-event-listener";
import { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { Column } from "./column";

export function Board({ initial }: { initial: TBoard }) {
  const [data, setData] = useState(initial);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      // Monitor for card dragging
      monitorForElements({
        canMonitor: isDraggingACard,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isCardData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];
          if (!innerMost) return;

          const dropTargetData = innerMost.data;
          const homeColumnIndex = data.columns.findIndex(
            (column) => column.id === dragging.columnId
          );
          const home = data.columns[homeColumnIndex];

          if (!home) return;

          const cardIndexInHome = home.cards.findIndex(
            (card) => card.id === dragging.card.id
          );

          // Dropping on a specific card
          if (isCardDropTargetData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.columnId
            );
            const destination = data.columns[destinationColumnIndex];

            // Reordering in the same column
            if (home === destination) {
              const cardFinishIndex = home.cards.findIndex(
                (c) => c.id === dropTargetData.card.id
              );

              if (cardIndexInHome === -1 || cardFinishIndex === -1) {
                return;
              }
              if (cardIndexInHome === cardFinishIndex) {
                return;
              }

              const closestEdge = extractClosestEdge(dropTargetData);
              const reordered = reorderWithEdge({
                axis: "vertical",
                list: home.cards,
                startIndex: cardIndexInHome,
                indexOfTarget: cardFinishIndex,
                closestEdgeOfTarget: closestEdge,
              });

              const updated: TColumn = { ...home, cards: reordered };
              const columns = [...data.columns];
              columns[homeColumnIndex] = updated;
              setData({ ...data, columns });
              return;
            }

            // Moving card to a different column
            if (!destination) {
              return;
            }

            const indexOfTarget = destination.cards.findIndex(
              (c) => c.id === dropTargetData.card.id
            );
            const closestEdge = extractClosestEdge(dropTargetData);
            const finalIndex =
              closestEdge === "bottom" ? indexOfTarget + 1 : indexOfTarget;

            // Remove from home
            const homeCards = [...home.cards];
            homeCards.splice(cardIndexInHome, 1);

            // Insert into destination
            const destinationCards = [...destination.cards];
            destinationCards.splice(finalIndex, 0, dragging.card);

            const columns = [...data.columns];
            columns[homeColumnIndex] = { ...home, cards: homeCards };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };
            setData({ ...data, columns });
            return;
          }

          // Dropping onto a column (not onto a card)
          if (isColumnData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.column.id
            );
            const destination = data.columns[destinationColumnIndex];
            if (!destination) return;

            // Dropping on home column
            if (home === destination) {
              const reordered = reorder({
                list: home.cards,
                startIndex: cardIndexInHome,
                finishIndex: home.cards.length - 1,
              });

              const updated: TColumn = { ...home, cards: reordered };
              const columns = [...data.columns];
              columns[homeColumnIndex] = updated;
              setData({ ...data, columns });
              return;
            }

            // Move card to the end of another column
            const homeCards = [...home.cards];
            homeCards.splice(cardIndexInHome, 1);

            const destinationCards = [...destination.cards];
            destinationCards.push(dragging.card);

            const columns = [...data.columns];
            columns[homeColumnIndex] = { ...home, cards: homeCards };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };
            setData({ ...data, columns });
          }
        },
      }),
      // Monitor for column dragging
      monitorForElements({
        canMonitor: isDraggingAColumn,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isColumnData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];
          if (!innerMost) return;

          const dropTargetData = innerMost.data;
          if (!isColumnData(dropTargetData)) {
            return;
          }

          const homeIndex = data.columns.findIndex(
            (column) => column.id === dragging.column.id
          );
          const destinationIndex = data.columns.findIndex(
            (column) => column.id === dropTargetData.column.id
          );

          if (homeIndex === -1 || destinationIndex === -1) {
            return;
          }
          if (homeIndex === destinationIndex) {
            return;
          }

          const reordered = reorder({
            list: data.columns,
            startIndex: homeIndex,
            finishIndex: destinationIndex,
          });
          setData({ ...data, columns: reordered });
        },
      }),
      // Automatic scrolling of the entire board horizontally
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) return false;
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getConfiguration: () => ({
          maxScrollSpeed: settings.boardScrollSpeed,
        }),
        element,
      }),
      // Overflow auto-scroll for the board
      unsafeOverflowAutoScrollForElements({
        element,
        getConfiguration: () => ({
          maxScrollSpeed: settings.boardScrollSpeed,
        }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) return false;
          if (!settings.isOverflowScrollingEnabled) return false;
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getOverflow() {
          return {
            forLeftEdge: {
              top: 1000,
              left: 1000,
              bottom: 1000,
            },
            forRightEdge: {
              top: 1000,
              right: 1000,
              bottom: 1000,
            },
          };
        },
      })
    );
  }, [data, settings]);

  // Panning the board with pointerdown + pointermove
  useEffect(() => {
    let cleanupActive: CleanupFn | null = null;
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    function begin({ startX }: { startX: number }) {
      let lastX = startX;

      const cleanupEvents = bindAll(
        window,
        [
          {
            type: "pointermove",
            listener(event) {
              const currentX = event.clientX;
              const diffX = lastX - currentX;
              lastX = currentX;
              //// had an error here poss null
              scrollable?.scrollBy({ left: diffX });
            },
          },
          // stop panning if we see any of these events
          ...(
            [
              "pointercancel",
              "pointerup",
              "pointerdown",
              "keydown",
              "resize",
              "click",
              "visibilitychange",
            ] as const
          ).map((eventName) => ({
            type: eventName,
            listener: () => cleanupEvents(),
          })),
        ],
        { capture: true }
      );

      cleanupActive = cleanupEvents;
    }

    const cleanupStart = bindAll(scrollable, [
      {
        type: "pointerdown",
        listener(event) {
          if (!(event.target instanceof HTMLElement)) return;
          // ignore interactive elements
          if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
            return;
          }
          begin({ startX: event.clientX });
        },
      },
    ]);

    return function cleanupAll() {
      cleanupStart();
      cleanupActive?.();
    };
  }, []);

  return (
    <Flex
      flexDir="column"
      height="100%"
      px={settings.isBoardMoreObvious ? 32 : 0}
      py={settings.isBoardMoreObvious ? 20 : 0}
    >
      <Flex
        ref={scrollableRef}
        flexDir="row"
        height="100%"
        gap={3}
        overflowX="auto"
        p={3}
        borderWidth={settings.isBoardMoreObvious ? "2px" : "0px"}
        borderStyle="dashed"
        borderColor={settings.isBoardMoreObvious ? "gray.200" : "transparent"}
        borderRadius={settings.isBoardMoreObvious ? "md" : "0"}
      >
        {data.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </Flex>
    </Flex>
  );
}

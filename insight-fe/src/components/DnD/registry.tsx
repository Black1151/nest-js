import invariant from "tiny-invariant";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";

export type CardEntry = { element: HTMLElement };
export type ColumnEntry = { element: HTMLElement };

export function createRegistry() {
  // ────────────────────────────────────────────────────────────────────────────
  // Internal state
  // ────────────────────────────────────────────────────────────────────────────
  const cards = new Map<string | number, CardEntry>();
  const columns = new Map<string, ColumnEntry>();

  // ────────────────────────────────────────────────────────────────────────────
  // Registration helpers
  // ────────────────────────────────────────────────────────────────────────────
  function registerCard({
    cardId,
    entry,
  }: {
    cardId: string | number;
    entry: CardEntry;
  }): CleanupFn {
    // add / overwrite immediately
    cards.set(cardId, entry);

    return () => {
      /**
       * If the element is unmounted _while a drag is still in flight_,
       * we need to keep the record alive for a tick so Pragmatic-DnD
       * can safely query it.
       */
      queueMicrotask(() => {
        // If someone already re-registered the same id
        // (e.g. it was re-mounted in another board) we must **not** delete it.
        const current = cards.get(cardId);
        if (current === entry) {
          cards.delete(cardId);
        }
      });
    };
  }

  function registerColumn({
    columnId,
    entry,
  }: {
    columnId: string;
    entry: ColumnEntry;
  }): CleanupFn {
    columns.set(columnId, entry);

    return () => {
      queueMicrotask(() => {
        const current = columns.get(columnId);
        if (current === entry) {
          columns.delete(columnId);
        }
      });
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Lookup helpers (type widened to accept number ids too)
  // ────────────────────────────────────────────────────────────────────────────
  function getCard(cardId: string | number): CardEntry {
    const entry = cards.get(cardId);
    invariant(entry, `Card '${cardId}' is not registered`);
    return entry;
  }

  function getColumn(columnId: string): ColumnEntry {
    const entry = columns.get(columnId);
    invariant(entry, `Column '${columnId}' is not registered`);
    return entry;
  }

  return { registerCard, registerColumn, getCard, getColumn };
}

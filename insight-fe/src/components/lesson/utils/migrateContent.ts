import { SemanticTokens } from "@/theme/helpers";
import { Slide } from "../slide/SlideSequencer";
import { SlideElementDnDItemProps, TableCell } from "@/components/DnD/cards/SlideElementDnDCard";

/**
 * Convert legacy lesson content using color palette indices to the
 * current format using semantic token names.
 */
export function migrateSlides(slides: Slide[], tokens?: SemanticTokens): Slide[] {
  const tokenKeys = tokens ? Object.keys(tokens.colors ?? {}) : [];

  const migrateCell = (cell: TableCell): TableCell => {
    const styles: any = (cell as any).styles;
    if (styles) {
      const { colorIndex, ...rest } = styles;
      const colorToken =
        typeof colorIndex === "number" ? tokenKeys[colorIndex] : styles.colorToken;
      (cell as any).styleOverrides = {
        ...rest,
        ...(colorToken ? { colorToken } : {}),
      };
      delete (cell as any).styles;
    }
    return cell;
  };

  const migrateItem = (item: SlideElementDnDItemProps): SlideElementDnDItemProps => {
    const styles: any = (item as any).styles;
    if (styles) {
      const { colorIndex, ...rest } = styles;
      const colorToken =
        typeof colorIndex === "number" ? tokenKeys[colorIndex] : styles.colorToken;
      (item as any).styleOverrides = {
        ...rest,
        ...(colorToken ? { colorToken } : {}),
      };
      delete (item as any).styles;
    }
    if (item.table?.cells) {
      item.table.cells = item.table.cells.map((row) => row.map(migrateCell));
    }
    return item;
  };

  return slides.map((slide) => ({
    ...slide,
    columnMap: Object.fromEntries(
      Object.entries(slide.columnMap).map(([id, col]) => [
        id,
        { ...col, items: col.items.map(migrateItem) },
      ])
    ),
  }));
}

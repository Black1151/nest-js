"use client";

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PaletteColorPicker from "../PaletteColorPicker";
import { TableCell } from "@/components/DnD/cards/SlideElementDnDCard";

interface TableAttributesProps {
  table: {
    rows: number;
    cols: number;
    cells: TableCell[][];
  };
  setTable: (table: { rows: number; cols: number; cells: TableCell[][] }) => void;
  colorPalettes?: { id: number; name: string; colors: string[] }[];
  selectedPaletteId?: number | "";
}

export default function TableAttributes({
  table,
  setTable,
  colorPalettes,
  selectedPaletteId,
}: TableAttributesProps) {
  const [rows, setRows] = useState<number | undefined>(table.rows);
  const [cols, setCols] = useState<number | undefined>(table.cols);
  const [cells, setCells] = useState<TableCell[][]>(table.cells);

  useEffect(() => {
    setRows(table.rows);
    setCols(table.cols);
    setCells(table.cells);
  }, [table.rows, table.cols, table.cells]);

  // adjust cell matrix when rows/cols change
  useEffect(() => {
    if (rows === undefined || cols === undefined) return;
    setCells((prev) => {
      const newRows = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => prev[r]?.[c] || { text: "", styles: { color: "#000000" } })
      );
      return newRows;
    });
  }, [rows, cols]);

  useEffect(() => {
    if (rows === undefined || cols === undefined) return;
    setTable({ rows, cols, cells });
  }, [rows, cols, cells, setTable]);

  const paletteColors =
    colorPalettes?.find((p) => Number(p.id) === Number(selectedPaletteId))?.colors ?? [];

  const updateCell = (r: number, c: number, cell: TableCell) => {
    setCells((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = cell;
      return next;
    });
  };

  return (
    <AccordionItem borderWidth="1px" borderColor="purple.300" borderRadius="md" mb={2}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">Table</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <Stack spacing={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Rows
            </FormLabel>
            <Input
              size="sm"
              type="number"
              w="60px"
              min={1}
              value={rows ?? ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setRows(Number.isNaN(val) ? undefined : Math.max(1, val));
              }}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Columns
            </FormLabel>
            <Input
              size="sm"
              type="number"
              w="60px"
              min={1}
              value={cols ?? ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCols(Number.isNaN(val) ? undefined : Math.max(1, val));
              }}
            />
          </FormControl>
          <SimpleGrid columns={cols} spacing={2}>
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <Stack key={`${rIdx}-${cIdx}`} spacing={1}>
                  <Input
                    size="sm"
                    placeholder="Text"
                    value={cell.text}
                    onChange={(e) =>
                      updateCell(rIdx, cIdx, { ...cell, text: e.target.value })
                    }
                  />
                  <PaletteColorPicker
                    value={cell.styles?.color || "#000000"}
                    onChange={(color) =>
                      updateCell(rIdx, cIdx, {
                        ...cell,
                        styles: { ...cell.styles, color },
                      })
                    }
                    paletteColors={paletteColors}
                  />
                </Stack>
              ))
            )}
          </SimpleGrid>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}

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
import { useEffect, useState, useRef } from "react";
import PaletteColorPicker from "../PaletteColorPicker";
import { TableCell } from "@/components/DnD/cards/SlideElementDnDCard";
import { SemanticTokens, tokenColor } from "@/theme/helpers";

interface TableAttributesProps {
  table: {
    rows: number;
    cols: number;
    cells: TableCell[][];
  };
  setTable: (table: { rows: number; cols: number; cells: TableCell[][] }) => void;
  tokens?: SemanticTokens;
}

export default function TableAttributes({
  table,
  setTable,
  tokens,
}: TableAttributesProps) {
  const [rows, setRows] = useState(table.rows);
  const [cols, setCols] = useState(table.cols);
  const [cells, setCells] = useState<TableCell[][]>(table.cells);
  const rowsRef = useRef(table.rows);
  const colsRef = useRef(table.cols);

  useEffect(() => {
    rowsRef.current = table.rows;
    colsRef.current = table.cols;
    setRows(table.rows);
    setCols(table.cols);
    setCells(table.cells);
  }, [table.rows, table.cols, table.cells]);

  const adjustMatrix = (
    prev: TableCell[][],
    newRows: number,
    newCols: number
  ): TableCell[][] =>
    Array.from({ length: newRows }, (_, r) =>
      Array.from(
        { length: newCols },
        (_, c) => prev[r]?.[c] || { text: "", styleOverrides: { colorToken: "" } }
      )
    );

  const handleRowsChange = (value: number) => {
    const r = Math.max(1, value);
    rowsRef.current = r;
    setRows(r);
    setCells((prev) => {
      const newCells = adjustMatrix(prev, r, colsRef.current);
      setTable({ rows: r, cols: colsRef.current, cells: newCells });
      return newCells;
    });
  };

  const handleColsChange = (value: number) => {
    const c = Math.max(1, value);
    colsRef.current = c;
    setCols(c);
    setCells((prev) => {
      const newCells = adjustMatrix(prev, rowsRef.current, c);
      setTable({ rows: rowsRef.current, cols: c, cells: newCells });
      return newCells;
    });
  };

  const updateTableCells = (updater: (cells: TableCell[][]) => TableCell[][]) => {
    setCells((prev) => {
      const next = updater(prev);
      setTable({ rows: rowsRef.current, cols: colsRef.current, cells: next });
      return next;
    });
  };

  const tokenKeys = tokens ? Object.keys(tokens.colors ?? {}) : [];

  const updateCell = (r: number, c: number, cell: TableCell) => {
    updateTableCells((prev) => {
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
              value={rows}
              onChange={(e) =>
                handleRowsChange(Math.max(1, parseInt(e.target.value) || 1))
              }
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
              value={cols}
              onChange={(e) =>
                handleColsChange(Math.max(1, parseInt(e.target.value) || 1))
              }
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
                    value={tokenKeys.indexOf(cell.styleOverrides?.colorToken ?? "")}
                    onChange={(idx) =>
                      updateCell(rIdx, cIdx, {
                        ...cell,
                        styleOverrides: {
                          ...cell.styleOverrides,
                          colorToken: tokenKeys[idx],
                        },
                      })
                    }
                    paletteColors={tokenKeys.map((k) => tokenColor(tokens, `colors.${k}`) || "")}
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

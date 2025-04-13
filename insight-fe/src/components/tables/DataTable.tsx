import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  HStack,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  display?: any;
  renderCell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onRowClick?: (rowData: T) => void;
}

function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onRowClick,
}: DataTableProps<T>) {
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const [paginationText, setPaginationText] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (key: keyof T) => {
    setSortConfig((prevState) => {
      if (prevState?.key === key && prevState.direction === "ascending") {
        return { key, direction: "descending" };
      }
      return { key, direction: "ascending" };
    });
  };

  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowDropUpIcon />
    ) : (
      <ArrowDropDownIcon />
    );
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onItemsPerPageChange(Number(event.target.value));
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  const paginationNumbers = Array.from(
    new Set(
      [5, 10, 25, 50, 100, 200, 500]
        .filter((option) => option <= data.length)
        .concat(data.length)
    )
  )
    .sort((a, b) => a - b)
    .map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));

  useEffect(() => {
    const text = isMobile
      ? `${currentPage} of ${totalPages}`
      : `Page ${currentPage} of ${totalPages}`;
    setPaginationText(text);
  }, [isMobile, currentPage, totalPages]);

  return (
    <VStack
      p={4}
      borderWidth={1}
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      maxW="100%"
      flex={1}
      justifyContent="space-between"
    >
      <TableContainer
        overflowX="auto"
        overflowY="auto"
        maxHeight={428}
        width="100%"
      >
        <Table variant="unstyled" colorScheme="gray" size="sm" layout="fixed">
          <Thead>
            <Tr>
              {columns.map(({ key, label, sortable, width, display }) => (
                <Th
                  key={String(key)}
                  cursor={sortable ? "pointer" : "default"}
                  onClick={() => sortable && handleSort(key)}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  bg="white"
                  position="sticky"
                  top="0"
                  zIndex={1}
                  width={width || "auto"}
                  display={display || "table-cell"}
                  textTransform="none"
                >
                  <HStack spacing={2}>
                    <Text fontSize={["xs", "sm"]}>{label}</Text>
                    {sortable && (
                      <Box w="40px" textAlign="center">
                        {getSortIcon(key)}
                      </Box>
                    )}
                  </HStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((item, index) => {
              const isOddRow = index % 2 !== 0;
              const rowKey = item.id ? item.id : index;
              return (
                <motion.tr
                  key={rowKey}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map(({ key, display, width, renderCell }) => (
                    <Td
                      key={String(key)}
                      display={display || "table-cell"}
                      width={width || "auto"}
                      bg={isOddRow ? "gray.100" : "white"}
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                    >
                      {renderCell ? renderCell(item) : item[key]}
                    </Td>
                  ))}
                </motion.tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid mt={4} width="100%" templateColumns="1fr 1fr">
        <HStack>
          <Text display={["none", null, null, null, "block"]} mr={2}>
            Showing:
          </Text>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="sm"
            width="auto"
          >
            {paginationNumbers}
          </Select>
          <Text>of {data.length}</Text>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text mx={1} minWidth={["60px", null, "120px"]} textAlign="center">
            {paginationText}
          </Text>
          <IconButton
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            icon={<ChevronLeftIcon />}
            aria-label="Previous page"
            size="sm"
          />
          <IconButton
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages || totalPages === 0}
            icon={<ChevronRightIcon />}
            aria-label="Next page"
            size="sm"
          />
        </HStack>
      </Grid>
    </VStack>
  );
}

export default DataTable;

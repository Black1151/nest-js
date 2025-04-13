import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";

interface Column {
  /** Must be unique across all columns */
  key: string;
  label: string;
}

interface DataTableSimpleProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
}

export function DataTableSimple({
  data,
  columns,
  onRowClick,
}: DataTableSimpleProps) {
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, rowIndex) => {
            const rowKey = item.id ?? `row-${rowIndex}`;

            return (
              <Tr
                key={rowKey}
                cursor={onRowClick ? "pointer" : "default"}
                _hover={onRowClick ? { backgroundColor: hoverBg } : {}}
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(item);
                  }
                }}
              >
                {columns.map((col) => (
                  <Td key={`${rowKey}-${col.key}`}>{item[col.key]}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

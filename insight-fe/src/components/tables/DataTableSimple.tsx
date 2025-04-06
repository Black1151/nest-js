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
          {data.map((item) => (
            <Tr
              key={item.id}
              cursor={onRowClick ? "pointer" : "default"}
              _hover={onRowClick ? { backgroundColor: hoverBg } : {}}
              onClick={() => {
                if (onRowClick) {
                  onRowClick(item);
                }
              }}
            >
              {columns.map((col) => (
                <Td key={`${item.id}-${col.key}`}>{item[col.key]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

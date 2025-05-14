// PaginationControls.tsx

import React from "react";
import { HStack, Select, IconButton } from "@chakra-ui/react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface PaginationControlsProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalItems,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <HStack mt={4} spacing={2} width="100%">
      <Select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        width={83}
      >
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Select>
      <IconButton
        aria-label="Previous Page"
        icon={<ArrowBack />}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        size="sm"
        isDisabled={page === 1}
      />
      <IconButton
        aria-label="Next Page"
        icon={<ArrowForward />}
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        size="sm"
        isDisabled={page === totalPages}
      />
    </HStack>
  );
};

export default PaginationControls;

import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
} from "@chakra-ui/react";
import PaginationControls from "./PaginationControls";
import DeleteButton from "@/components/Buttons/iconButtons/DeleteButton";
import { EditButton } from "@/components/Buttons/iconButtons/EditButton";
import { ViewButton } from "@/components/Buttons/iconButtons/ViewButton";
import { AddIcon } from "@chakra-ui/icons"; // Chakra UI icon for the add button
import { IconButton } from "@chakra-ui/react";

interface ClassItem {
  id: string;
  name: string;
}

interface ClassListProps {
  classes: ClassItem[];
  onViewClick: (classId: string) => void;
  onEditClick: (classId: string) => void;
  onDeleteClick: (classId: string) => void;
  onAddAssignmentClick: (classId: string) => void; // New prop for Add Assignment
}

const ClassList: React.FC<ClassListProps> = ({
  classes,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onAddAssignmentClick, // Destructure the new prop
}) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const displayedClasses = classes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <VStack width="100%">
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Class Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayedClasses.map((classItem) => (
            <Tr key={classItem.id}>
              <Td>{classItem.name}</Td>
              <Td>
                <HStack gap={2}>
                  <ViewButton onClick={() => onViewClick(classItem.id)} />
                  <EditButton onClick={() => onEditClick(classItem.id)} />
                  <DeleteButton onClick={() => onDeleteClick(classItem.id)} />
                  <IconButton
                    icon={<AddIcon />}
                    aria-label="Add Assignment"
                    colorScheme="blue"
                    onClick={() => onAddAssignmentClick(classItem.id)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PaginationControls
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={classes.length}
      />
    </VStack>
  );
};

export default ClassList;

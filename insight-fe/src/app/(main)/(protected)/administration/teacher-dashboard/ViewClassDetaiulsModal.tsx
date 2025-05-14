import React from "react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  user?: any;
}

interface ClassItem {
  id: string;
  name: string;
  teachers: UserItem[];
  students: UserItem[];
}

interface ViewClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: ClassItem;
}

const ViewClassDetailsModal: React.FC<ViewClassDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
}) => {
  return (
    <PerygonModal
      title="Class Details"
      body={
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Class Name:
            </Text>
            <Text>{selectedClass.name}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Teachers:
            </Text>
            <VStack align="start" spacing={2}>
              {selectedClass.teachers.map((teacher) => (
                <HStack
                  key={teacher.id}
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  w="100%"
                >
                  <Text>{teacher.user?.firstName || teacher.firstName}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Students:
            </Text>
            <VStack align="start" spacing={2}>
              {selectedClass.students.map((student) => (
                <HStack
                  key={student.id}
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  w="100%"
                >
                  <Text>{student.user?.firstName || student.firstName}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      }
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default ViewClassDetailsModal;

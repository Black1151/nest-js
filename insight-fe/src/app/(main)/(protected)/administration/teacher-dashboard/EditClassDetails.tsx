import React, { useState } from "react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { VStack, HStack, Text, Input, Box, Button } from "@chakra-ui/react";
import DeleteButton from "@/components/Buttons/iconButtons/DeleteButton";
import UserSearchInput from "./UserSearchInput";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  user?: any; // Replace 'any' with appropriate type if available
}

interface ClassItem {
  id: string;
  name: string;
  teachers: UserItem[];
  students: UserItem[];
}

interface EditClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: ClassItem;
  fetchClasses: () => void;
}

const EditClassDetailsModal: React.FC<EditClassDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
  fetchClasses,
}) => {
  const [className, setClassName] = useState<string>(selectedClass.name);
  const [selectedStudents, setSelectedStudents] = useState<UserItem[]>(
    selectedClass.students
  );
  const [selectedTeachers, setSelectedTeachers] = useState<UserItem[]>(
    selectedClass.teachers
  );

  const handleSaveClass = async () => {
    const teacherIds = selectedTeachers.map((teacher) => teacher.id);
    const studentIds = selectedStudents.map((student) => student.id);

    try {
      const response = await fetch(`/api/class/updateClass`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedClass.id,
          name: className,
          teacherIds,
          studentIds,
        }),
      });

      if (response.ok) {
        console.log("Class updated successfully");
        fetchClasses();
        onClose();
      } else {
        console.error("Error updating class");
      }
    } catch (error) {
      console.error("ERROR IN UPDATING CLASS", error);
    }
  };

  return (
    <PerygonModal
      title="Edit Class Details"
      body={
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Class Name:
            </Text>
            <Input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Teachers:
            </Text>
            <VStack align="start" spacing={2}>
              {selectedTeachers.map((teacher) => (
                <HStack
                  key={teacher.id}
                  justifyContent="space-between"
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  w="100%"
                >
                  <Text>
                    {teacher.user?.firstName || teacher.firstName}{" "}
                    {teacher.user?.lastName || teacher.lastName}
                  </Text>
                  <DeleteButton
                    onClick={() =>
                      setSelectedTeachers((prev) =>
                        prev.filter((t) => t.id !== teacher.id)
                      )
                    }
                  />
                </HStack>
              ))}
            </VStack>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Students:
            </Text>
            <VStack align="start" spacing={2}>
              {selectedStudents.map((student) => (
                <HStack
                  key={student.id}
                  justifyContent="space-between"
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  w="100%"
                >
                  <Text>
                    {student.user?.firstName || student.firstName}{" "}
                    {student.user?.lastName || student.lastName}
                  </Text>
                  <DeleteButton
                    onClick={() =>
                      setSelectedStudents((prev) =>
                        prev.filter((s) => s.id !== student.id)
                      )
                    }
                  />
                </HStack>
              ))}
            </VStack>
          </Box>

          <UserSearchInput
            role="student"
            onSelectUser={(user: UserItem) =>
              setSelectedStudents((prev) => [...prev, user])
            }
          />
          <UserSearchInput
            role="teacher"
            onSelectUser={(user: UserItem) =>
              setSelectedTeachers((prev) => [...prev, user])
            }
          />
          <Button colorScheme="blue" onClick={handleSaveClass}>
            Save Class
          </Button>
        </VStack>
      }
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default EditClassDetailsModal;

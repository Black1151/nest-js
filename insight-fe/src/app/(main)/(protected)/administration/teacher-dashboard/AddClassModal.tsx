// AddClassModal.tsx

import React, { useState } from "react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { VStack, Input, Button } from "@chakra-ui/react";

import UserList from "./UserList";
import UserSearchInput from "./UserSearchInput";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  year?: string;
}

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClose: () => void;
  fetchClasses: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  onConfirmClose,
  fetchClasses,
}) => {
  const [className, setClassName] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<UserItem[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<UserItem[]>([]);

  const handleCreateClass = async () => {
    const teacherIds = selectedTeachers.map((teacher) => teacher.id);
    const studentIds = selectedStudents.map((student) => student.id);

    try {
      const response = await fetch("/api/class/createClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: className, teacherIds, studentIds }),
      });

      if (response.ok && response.status === 201) {
        console.log("Class created successfully");
        fetchClasses();
        handleClearState();
        onClose();
      } else {
        console.error("Error creating class");
      }
    } catch (error) {
      console.error("ERROR IN CREATING CLASS", error);
    }
  };

  const handleClearState = () => {
    setClassName("");
    setSelectedStudents([]);
    setSelectedTeachers([]);
  };

  const handleAddClassModalClose = () => {
    onConfirmClose();
  };

  return (
    <PerygonModal
      title="Add New Class"
      body={
        <VStack spacing={4}>
          <Input
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />

          <UserSearchInput
            role="student"
            onSelectUser={(user: UserItem) =>
              setSelectedStudents((prev) => [...prev, user])
            }
          />
          <UserList users={selectedStudents} />

          <UserSearchInput
            role="teacher"
            onSelectUser={(user: UserItem) =>
              setSelectedTeachers((prev) => [...prev, user])
            }
          />
          <UserList users={selectedTeachers} />

          <Button colorScheme="blue" onClick={handleCreateClass}>
            Create Class
          </Button>
        </VStack>
      }
      isOpen={isOpen}
      onClose={handleAddClassModalClose}
    />
  );
};

export default AddClassModal;

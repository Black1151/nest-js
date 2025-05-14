"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  HStack,
  IconButton,
  HStack as ChakraHStack,
  Grid,
  Box,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import ConfirmCloseModal from "./ConfimrCloseModal";
import AddClassModal from "./AddClassModal";
import ViewClassDetailsModal from "./ViewClassDetaiulsModal";
import EditClassDetailsModal from "./EditClassDetails";
import ConfirmationModal from "./ConfirmationModal";
import AddAssignmentModal from "./AddAssignmentModal";

import DeleteButton from "@/components/Buttons/iconButtons/DeleteButton";
import { EditButton } from "@/components/Buttons/iconButtons/EditButton";
import { ViewButton } from "@/components/Buttons/iconButtons/ViewButton";
import DataTable, { Column } from "@/components/table/DataTable/DataTable";

interface User {
  id: number;
  email: string;
  password: string;
  role: "teacher" | "student" | "admin";
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

interface Teacher {
  id: number;
  user_id: number;
  user: User;
}

interface Student {
  id: number;
  user_id: number;
  user_year_id: number;
  user: User;
}

interface ClassItem {
  id: string;
  name: string;
  teachers: UserItem[];
  students: UserItem[];
}

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  year: string;
}

interface Assignment {
  id: number;
  name: string;
  dueDate: string;
  class: {
    id: number;
    name: string;
  };
}

const TeacherDashboardPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmCloseModalOpen, setIsConfirmCloseModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [idOfClassToDelete, setIdOfClassToDelete] = useState<string | null>(
    null
  );
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] =
    useState(false);
  const [selectedClassIdForAssignment, setSelectedClassIdForAssignment] =
    useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [currentPageClasses, setCurrentPageClasses] = useState<number>(1);
  const [itemsPerPageClasses, setItemsPerPageClasses] = useState<number>(10);

  const [currentPageAssignments, setCurrentPageAssignments] =
    useState<number>(1);
  const [itemsPerPageAssignments, setItemsPerPageAssignments] =
    useState<number>(10);

  useEffect(() => {
    fetchClassesByUser();
    fetchAssignmentsByTeacher();
  }, []);

  const fetchClassesByUser = async () => {
    try {
      const response = await fetch(`/api/class/getClassesByUser`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchAssignmentsByTeacher = async () => {
    try {
      const response = await fetch(`/api/assignment/getAssignmentsForTeacher`);
      const data = await response.json();

      console.log("assignments", data);
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleViewClassClick = async (classId: string) => {
    try {
      const response = await fetch(
        `/api/class/getFullClassDetails?id=${classId}`
      );
      const data = await response.json();
      setSelectedClass(data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  const handleEditClassClick = async (classId: string) => {
    try {
      const response = await fetch(
        `/api/class/getFullClassDetails?id=${classId}`
      );
      const data = await response.json();
      setSelectedClass(data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  const handleAddAssignment = async (
    assignmentName: string,
    dueDate: string
  ) => {
    console.log("assignmentName", assignmentName);
    console.log("dueDate", dueDate);
    try {
      const response = await fetch("/api/assignment/createAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClassIdForAssignment,
          assignmentName,
          dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add assignment.");
      }

      const data = await response.json();
      console.log("Assignment added successfully:", data);
      fetchAssignmentsByTeacher();
    } catch (error) {
      console.error("Error adding assignment:", error);
    } finally {
      setIsAddAssignmentModalOpen(false);
    }
  };

  const handleAddAssignmentClick = (classId: string) => {
    setSelectedClassIdForAssignment(classId);
    setIsAddAssignmentModalOpen(true);
  };

  const handleClearClassDetailsState = () => {
    setSelectedClass(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    handleClearClassDetailsState();
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    handleClearClassDetailsState();
  };

  const handleDeleteClassClick = async (classId: string) => {
    setIsConfirmDeleteModalOpen(true);
    setIdOfClassToDelete(classId);
  };

  const handleDeleteClass = async () => {
    try {
      const response = await fetch(
        `/api/class/deleteClass?id=${idOfClassToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Class deleted successfully:", data);
    } catch (error) {
      console.error("Error deleting class:", error);
    } finally {
      setIsConfirmDeleteModalOpen(false);
      fetchClassesByUser();
    }
  };

  const classColumns: Column<ClassItem>[] = [
    {
      key: "name",
      label: "Class Name",
      sortable: true,
    },
    {
      key: "actions" as keyof ClassItem,
      label: "Actions",
      sortable: false,
      renderCell: (classItem: ClassItem) => (
        <ChakraHStack gap={2}>
          <ViewButton onClick={() => handleViewClassClick(classItem.id)} />
          <EditButton onClick={() => handleEditClassClick(classItem.id)} />
          <DeleteButton onClick={() => handleDeleteClassClick(classItem.id)} />
          <IconButton
            icon={<AddIcon />}
            aria-label="Add Assignment"
            colorScheme="blue"
            onClick={() => handleAddAssignmentClick(classItem.id)}
          />
        </ChakraHStack>
      ),
    },
  ];

  const assignmentColumns: Column<Assignment>[] = [
    {
      key: "name",
      label: "Assignment Name",
      sortable: true,
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      renderCell: (item) => new Date(item.dueDate).toLocaleDateString(),
    },
    {
      key: "class",
      label: "Class Name",
      sortable: true,
      renderCell: (item) => item.class.name,
    },
  ];

  const handleAssignmentRowClick = (assignment: Assignment) => {
    console.log("Assignment clicked:", assignment);
    // Placeholder for future logic to display assignment data
  };

  return (
    <div>
      <Button colorScheme="blue" onClick={() => setIsAddClassModalOpen(true)}>
        Add New Class
      </Button>

      <AddClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        onConfirmClose={() => setIsConfirmCloseModalOpen(true)}
        fetchClasses={fetchClassesByUser}
      />

      <ConfirmCloseModal
        isOpen={isConfirmCloseModalOpen}
        onClose={() => setIsConfirmCloseModalOpen(false)}
        onConfirm={() => {
          setIsConfirmCloseModalOpen(false);
          setIsAddClassModalOpen(false);
        }}
      />

      <Grid templateColumns="1fr 1fr" gap={4} mt={4}>
        <Box>
          <DataTable<ClassItem>
            data={classes}
            columns={classColumns}
            currentPage={currentPageClasses}
            itemsPerPage={itemsPerPageClasses}
            onPageChange={setCurrentPageClasses}
            onItemsPerPageChange={setItemsPerPageClasses}
          />
        </Box>

        <Box>
          <DataTable<Assignment>
            data={assignments}
            columns={assignmentColumns}
            currentPage={currentPageAssignments}
            itemsPerPage={itemsPerPageAssignments}
            onPageChange={setCurrentPageAssignments}
            onItemsPerPageChange={setItemsPerPageAssignments}
            onRowClick={handleAssignmentRowClick}
          />
        </Box>
      </Grid>

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleDeleteClass}
        title={"Delete class"}
        message={
          "Warning: This will delete the class, remove its association to all teachers and students, and remove all assigned work and lessons. THIS CANNOT BE UNDONE Are you sure?"
        }
        enhancedConfirm={true}
      />

      <AddAssignmentModal
        isOpen={isAddAssignmentModalOpen}
        onClose={() => setIsAddAssignmentModalOpen(false)}
        onSubmit={handleAddAssignment}
      />

      {selectedClass && (
        <>
          <ViewClassDetailsModal
            isOpen={isViewModalOpen}
            onClose={closeViewModal}
            selectedClass={selectedClass}
          />

          <EditClassDetailsModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            selectedClass={selectedClass}
            fetchClasses={fetchClassesByUser}
          />
        </>
      )}
    </div>
  );
};

export default TeacherDashboardPage;

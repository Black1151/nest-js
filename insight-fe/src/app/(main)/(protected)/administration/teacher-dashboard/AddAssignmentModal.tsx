import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentName: string, dueDate: string) => void;
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [dueDate, setDueDate] = useState("");
  const [assignmentName, setAssignmentName] = useState("");

  const handleSubmit = () => {
    if (!assignmentName || !dueDate) {
      alert("Please fill in both fields before submitting.");
      return;
    }
    onSubmit(assignmentName, dueDate);
    setDueDate("");
    setAssignmentName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Assignment</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Assignment Name</FormLabel>
            <Input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="Enter assignment name"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
          <Button ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAssignmentModal;

"use client";

import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { CreateUserModal } from "../../user-manager/_components/modals/CreateUserModal";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import {
  Input,
  VStack,
  Heading,
  HStack,
  Button,
  List,
  ListItem,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";
import { useMemo, useState } from "react";
import EducatorSearchInput from "./EducatorSearchInput";
import StudentSearchInput from "./StudentSearchInput";
import { ClassDropdown } from "./dropdowns/ClassDropdown/ClassDropdown";

const GET_CLASS_WITH_MEMBERS = typedGql("query")({
  getClass: [
    { data: $("data", "IdInput!") },
    {
      id: true,
      name: true,
      students: { id: true, studentId: true, schoolYear: true },
      educators: { id: true, staffId: true },
    },
  ],
} as const);

const UPDATE_CLASS = typedGql("mutation")({
  updateClass: [{ data: $("data", "UpdateClassInput!") }, { id: true }],
} as const);

interface Props {
  classId: string | null;
  yearGroupId: string | null;
  subjectId: string | null;
  setClassId: (id: string | null) => void;
}

export default function ClassMembersPane({
  classId,
  yearGroupId,
  subjectId,
  setClassId,
}: Props) {
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState<"student" | "educator">("student");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const variables = useMemo(
    () =>
      classId
        ? {
            data: { id: Number(classId), relations: ["students", "educators"] },
          }
        : undefined,
    [classId]
  );

  const { data, loading, refetch } = useQuery(GET_CLASS_WITH_MEMBERS, {
    variables,
    skip: !classId,
  });

  const [updateClass] = useMutation(UPDATE_CLASS);

  const students = data?.getClass?.students ?? [];
  const educators = data?.getClass?.educators ?? [];

  const filteredStudents = students.filter((s) =>
    String(s.studentId).toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = async (studentId: string) => {
    if (!classId) return;
    await updateClass({
      variables: {
        data: {
          id: Number(classId),
          relationIds: [{ relation: "students", ids: [Number(studentId)] }],
        },
      },
    });
    refetch();
  };

  const handleAddEducator = async (educatorId: string) => {
    if (!classId) return;
    await updateClass({
      variables: {
        data: {
          id: Number(classId),
          relationIds: [{ relation: "educators", ids: [Number(educatorId)] }],
        },
      },
    });
    refetch();
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "studentId", label: "Student ID" },
    { key: "schoolYear", label: "School Year" },
  ];

  return (
    <ContentCard gap={4} overflow="hidden">
      <Flex flexDir="column" gap={2}>
        <Text>Class</Text>
        <ClassDropdown
          yearGroupId={yearGroupId}
          subjectId={subjectId}
          value={classId}
          onChange={(id: string | null) => setClassId(id)}
        />
      </Flex>
      <VStack align="stretch" spacing={4} overflow="auto">
        {/* ---------- Educators section ---------- */}
        <Heading size="md">Educators</Heading>
        <EducatorSearchInput onSelect={handleAddEducator} />
        <List spacing={1}>
          {educators.map((e) => (
            <ListItem key={String(e.id)}>{`Staff ID ${e.staffId}`}</ListItem>
          ))}
        </List>

        {/* ---------- Students section ---------- */}
        <Heading size="md" pt={2}>
          Students
        </Heading>
        <StudentSearchInput onSelect={handleAddStudent} />
        <Input
          placeholder="Filter students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataTableSimple data={filteredStudents} columns={columns} />

        <HStack>
          <Button
            colorScheme="green"
            onClick={() => {
              setModalType("student");
              setIsModalOpen(true);
            }}
          >
            Create Student
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              setModalType("educator");
              setIsModalOpen(true);
            }}
          >
            Create Educator
          </Button>
        </HStack>
      </VStack>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType={modalType}
      />
    </ContentCard>
  );
}

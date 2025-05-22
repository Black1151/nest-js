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
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

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

interface Props {
  classId: string | null;
}

export default function ClassMembersPane({ classId }: Props) {
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState<"student" | "educator">("student");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const variables = useMemo(
    () =>
      classId ? { data: { id: Number(classId), relations: ["students", "educators"] } } : undefined,
    [classId]
  );

  const { data, loading, refetch } = useQuery(GET_CLASS_WITH_MEMBERS, {
    variables,
    skip: !classId,
  });

  const students = data?.getClass?.students ?? [];
  const educators = data?.getClass?.educators ?? [];

  const filteredStudents = students.filter((s) =>
    String(s.studentId).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "id", label: "ID" },
    { key: "studentId", label: "Student ID" },
    { key: "schoolYear", label: "School Year" },
  ];

  return (
    <ContentCard gap={4} overflow="hidden">
      {!classId ? (
        <Heading size="md">Select a class to view members</Heading>
      ) : (
        <VStack align="stretch" gap={4} overflow="hidden">
          <VStack align="stretch" gap={2}>
            <Heading size="md">Educators</Heading>
            {educators.length ? (
              educators.map((e) => (
                <span key={e.id}>Staff ID: {e.staffId}</span>
              ))
            ) : (
              <span>No educators</span>
            )}
          </VStack>

          <VStack align="stretch" gap={2}>
            <HStack>
              <Heading size="md" flex={1}>
                Students
              </Heading>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => {
                  setModalType("student");
                  setIsModalOpen(true);
                }}
              >
                Add Student
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  setModalType("educator");
                  setIsModalOpen(true);
                }}
              >
                Add Staff
              </Button>
            </HStack>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
            />
            <DataTableSimple data={filteredStudents} columns={columns} />
          </VStack>
        </VStack>
      )}

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
        userType={modalType}
      />
    </ContentCard>
  );
}

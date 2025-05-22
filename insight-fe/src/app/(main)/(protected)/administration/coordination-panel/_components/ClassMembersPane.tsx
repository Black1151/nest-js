"use client";

import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { CreateUserModal } from "../../user-manager/_components/modals/CreateUserModal";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { Input, VStack, Heading, HStack, Button } from "@chakra-ui/react";
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
      class details here
    </ContentCard>
  );
}

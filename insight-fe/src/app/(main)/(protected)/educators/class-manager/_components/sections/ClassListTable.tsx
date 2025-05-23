"use client";

import { useQuery } from "@apollo/client";
import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

export const GET_EDUCATOR_PROFILE = typedGql("query")({
  getUserByPublicId: [
    { data: $("data", "PublicIdRequestDto!") },
    { educatorProfile: { id: true } },
  ],
} as const);

export const GET_ALL_CLASSES = typedGql("query")({
  getAllClass: [
    { data: { all: true, relations: ["educators", "yearGroup", "subject"] } },
    {
      id: true,
      name: true,
      yearGroup: { year: true },
      subject: { name: true },
      educators: { id: true },
    },
  ],
} as const);

interface ClassListTableProps {
  setSelectedClassId?: (id: string) => void;
}

export default function ClassListTable({ setSelectedClassId }: ClassListTableProps) {
  const { userPublicId } = useAuth();

  const { data: userData, loading: loadingUser } = useQuery(GET_EDUCATOR_PROFILE, {
    variables: { data: { publicId: userPublicId } },
    skip: !userPublicId,
  });

  const educatorId = userData?.getUserByPublicId?.educatorProfile?.id;

  const { data, loading, error } = useQuery(GET_ALL_CLASSES, {
    skip: !educatorId,
  });

  if (loadingUser || loading) {
    return <LoadingSpinnerCard text="Loading Classes..." />;
  }

  if (error || !data) {
    return <ContentCard>Error loading classes: {error?.message}</ContentCard>;
  }

  const classes = (data.getAllClass ?? []).filter((cls) =>
    cls.educators?.some((e) => String(e.id) === String(educatorId))
  );

  const formattedData = classes.map((c) => ({
    id: c.id,
    name: c.name,
    subject: c.subject?.name ?? "",
    year: c.yearGroup?.year ?? "",
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Class Name" },
    { key: "subject", label: "Subject" },
    { key: "year", label: "Year" },
  ];

  return (
    <ContentCard>
      <DataTableSimple
        data={formattedData}
        columns={columns}
        onRowClick={(row) => setSelectedClassId?.(row.id)}
      />
    </ContentCard>
  );
}

"use client";

import React, { Suspense } from "react";
import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { useQuery, User } from "@/gqty";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";

interface UserListTableProps {
  setSelectedUserPublicId: (publicId: string) => void;
}

function UserListTable({ setSelectedUserPublicId }: UserListTableProps) {
  const query = useQuery({ suspense: true });
  const users = query.getAllUsers({ data: { limit: 10, offset: 0 } });

  const formattedData = users.map((u: User) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    publicId: u.publicId,
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
  ];

  const handleRowClick = (rowData: any) => {
    setSelectedUserPublicId(rowData.publicId);
  };

  return (
    <ContentCard>
      <DataTableSimple
        data={formattedData}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </ContentCard>
  );
}

export default function UserListTableWrapper(props: UserListTableProps) {
  return (
    <Suspense fallback={<LoadingSpinnerCard text="Loading Users..." />}>
      <UserListTable {...props} />
    </Suspense>
  );
}

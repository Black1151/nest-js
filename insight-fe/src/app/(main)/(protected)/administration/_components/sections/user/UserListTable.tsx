"use client";

import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { useQuery } from "@/gqty";
import { Button } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";

interface UserListTableProps {
  setSelectedUserPublicId: (publicId: string) => void;
}

export default function UserListTable({
  setSelectedUserPublicId,
}: UserListTableProps) {
  const query = useQuery();

  const users = query.getAllUsers({ data: { limit: 10, offset: 0 } });

  const formattedData = useMemo(
    () =>
      users.map((u: any) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        publicId: u.publicId,
      })),
    [users]
  );

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
    ],
    []
  );

  const handleRowClick = useCallback(
    (rowData: any) => {
      setSelectedUserPublicId(rowData.publicId);
    },
    [setSelectedUserPublicId]
  );

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

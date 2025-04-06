"use client";

import { ContentCard } from "@/components/layout/Card";

import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { useQuery } from "@/gqty";

interface UserListTableProps {
  setSelectedUserPublicId: (publicId: string) => void;
}

export default function UserListTable({
  setSelectedUserPublicId,
}: UserListTableProps) {
  console.log(">>>>>>>>>>>>>>>>>>USER LIST TABLE RENDER");

  const query = useQuery();

  const users = query.getAllUsers({ data: { limit: 10, offset: 0 } });

  const formattedData = users.map((u: any) => ({
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

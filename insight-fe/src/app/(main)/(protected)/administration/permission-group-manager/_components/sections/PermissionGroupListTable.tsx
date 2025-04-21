import { PermissionGroup, useQuery, User } from "@/gqty";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { Button, Flex } from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
import { CreateUserModal } from "../../../user-manager/_components/modals/CreateUserModal";
import { CreatePermissionGroupModal } from "./modals/CreatePermissionGroupModal";

interface PermissionGroupListTableProps {
  setSelectedPermissionGroupId: (publicId: string) => void;
}

function PermissionGroupListTable({
  setSelectedPermissionGroupId,
}: PermissionGroupListTableProps) {
  const [
    isCreatePermissionGroupModalOpen,
    setIsCreatePermissionGroupModalOpen,
  ] = useState(false);
  const query = useQuery();
  const { isLoading } = query.$state;
  const permissionGroups =
    query.getAllPermissionGroup({ data: { limit: 10, offset: 0 } }) ?? [];

  const formattedData = permissionGroups.map((u: PermissionGroup) => ({
    id: u.id,
    name: u.name,
    description: u.description,
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const handleRowClick = (rowData: any) => {
    setSelectedPermissionGroupId(rowData.id);
  };

  if (isLoading) {
    return <LoadingSpinnerCard text="Loading Permission Groups..." />;
  }

  return (
    <>
      <ContentCard>
        {formattedData[0].id && (
          <Flex
            justifyContent="space-between"
            flexDirection="column"
            height="100%"
            width="100%"
          >
            <DataTableSimple
              data={formattedData}
              columns={columns}
              onRowClick={handleRowClick}
            />
            <Button
              colorScheme="green"
              onClick={() => setIsCreatePermissionGroupModalOpen(true)}
            >
              Create Permission Group
            </Button>
          </Flex>
        )}
      </ContentCard>
      <CreatePermissionGroupModal
        isOpen={isCreatePermissionGroupModalOpen}
        onClose={() => setIsCreatePermissionGroupModalOpen(false)}
      />
    </>
  );
}

export default function PermissionGroupListTableWrapper(
  props: PermissionGroupListTableProps
) {
  return (
    <Suspense
      fallback={<LoadingSpinnerCard text="Loading Permission Groups..." />}
    >
      <PermissionGroupListTable {...props} />
    </Suspense>
  );
}

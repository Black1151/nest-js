import { PermissionGroup, useQuery } from "@/gqty";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { ContentCard } from "@/components/layout/Card";
import { DataTableSimple } from "@/components/tables/DataTableSimple";
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

  console.log(formattedData);

  if (!formattedData[0]) {
    return (
      <>
        <ContentCard height={700}>
          <Center flex={1}>
            <Text fontSize="2xl">No permission groups found</Text>
          </Center>
          <Button
            colorScheme="green"
            onClick={() => setIsCreatePermissionGroupModalOpen(true)}
          >
            Create Permission Group
          </Button>
        </ContentCard>
        <CreatePermissionGroupModal
          isOpen={isCreatePermissionGroupModalOpen}
          onClose={() => setIsCreatePermissionGroupModalOpen(false)}
        />
      </>
    );
  }

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
      <ContentCard height={700}>
        {formattedData[0] && (
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

import { ContentCard } from "@/components/layout/Card";
import { Role, useQuery } from "@/gqty";

import { Button, Center, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CreateRoleModal } from "./sub/modals/CreateRoleModal";

interface UserRolesSectionProps {
  publicId: string | null;
}

// export const prepareUserRoles = (userRoles: Role[]) => {
//   userRoles.forEach((role) => {
//     role.id;
//     role.name;
//     role.description;
//   });
// };

export const UserRolesSection = ({ publicId }: UserRolesSectionProps) => {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  const query = useQuery();

  if (!publicId)
    return (
      <ContentCard height={700}>
        <Center flex={1}>
          <Text fontSize="2xl">No user selected</Text>
        </Center>
      </ContentCard>
    );

  // const query = useQuery({
  //   prepare({ query: { getRolesForUser } }) {
  //     if (!publicId) return;
  //     const userRoles = getRolesForUser({ data: { publicId } });
  //     prepareUserRoles(userRoles);
  //   },
  // });

  const availableRoles = query.getAllRole({ data: { all: true } });

  const userRoles = query.getRolesForUser({ data: { publicId } });

  const userRolesListItems = userRoles?.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
  }));

  // also should filter out roles that are already in the user roles list
  const availableRolesListItems = availableRoles?.filter(
    (role) => !userRolesListItems?.some((userRole) => userRole.id === role.id)
  );

  const TwoColumnDnDProps = {
    leftColHeader: "Users roles",
    rightColHeader: "Available roles",
    leftColColor: "teal.100",
    rightColColor: "orange.100",
    initialRightItems: availableRolesListItems,
    initialLeftItems: userRolesListItems,
  };

  console.log(TwoColumnDnDProps);

  return (
    <>
      <ContentCard>
        <Button
          colorScheme="green"
          onClick={() => setIsCreateRoleModalOpen(true)}
        >
          Create new role
        </Button>
      </ContentCard>
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
      />
    </>
  );
};

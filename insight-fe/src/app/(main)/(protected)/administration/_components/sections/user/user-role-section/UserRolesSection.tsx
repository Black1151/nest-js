import { ContentCard } from "@/components/layout/Card";
import { Role, useQuery } from "@/gqty";
import TwoColumnDnD from "./components/TwoColumnDnD";

interface UserRolesSectionProps {
  publicId: string | null;
}

export const prepareUserRoles = (userRoles: Role[]) => {
  userRoles.forEach((role) => {
    role.id;
    role.name;
    role.description;
  });
};

export const UserRolesSection = ({ publicId }: UserRolesSectionProps) => {
  const query = useQuery({
    prepare({ query: { getRolesForUser } }) {
      if (!publicId) return;
      const userRoles = getRolesForUser({ data: { publicId } });
      prepareUserRoles(userRoles);
    },
  });

  const roles = publicId
    ? query.getUsersRolesAndPermissions({ data: { publicId } })
    : null;

  const TwoColumnDnDProps = {
    leftColHeader: "Users roles",
    rightColHeader: "Available roles",
    leftColColor: "teal.100",
    rightColColor: "orange.100",
    rightColItems: [
      { id: "item-1", label: "Item 1" },
      { id: "item-2", label: "Item 2" },
      { id: "item-3", label: "Item 3" },
    ],
    leftColItems: [
      { id: "item-4", label: "Item 4" },
      { id: "item-5", label: "Item 5" },
      { id: "item-6", label: "Item 6" },
    ],
  };

  return (
    <ContentCard>
      <TwoColumnDnD {...TwoColumnDnDProps} />
    </ContentCard>
  );
};

"use client";

import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";

import { useCallback } from "react";
import { UpdateUserRolesFromArrayRequestDto, useMutation } from "@/gqty";
import { Button } from "@chakra-ui/react";
import { RoleDnDItem, RoleDnDItemProps } from "./components/RoleDnDItem";

export interface UserRolesDnDProps {
  userRoles: RoleDnDItemProps[];
  availableRoles: RoleDnDItemProps[];
}

export default function UserRolesDnD({
  userRoles,
  availableRoles,
}: UserRolesDnDProps) {
  const handleColumnChange = () => {
    console.log("TEST");
  };

  const [updateUserRolesFromArray] = useMutation(
    (mutation, data: UpdateUserRolesFromArrayRequestDto) => {
      const mutationReturn = mutation.updateUserRolesFromArray({ data });
      mutationReturn.id;
    }
  );

  const columnMap: Record<string, ColumnType<RoleDnDItemProps>> = {
    userRoles: {
      title: "User Roles",
      columnId: "userRoles",
      styles: {
        container: { border: "3px dashed orange", width: "300px" },
        header: { bg: "orange.500", color: "white" },
        card: { bg: "orange.200", _hover: { bg: "orange.300" } },
      },
      items: userRoles,
    },
    availableRoles: {
      title: "Available Roles",
      columnId: "availableRoles",
      styles: {
        container: { border: "3px dashed purple", width: "300px" },
        header: { bg: "purple.700", color: "white" },
        card: { bg: "purple.200", _hover: { bg: "purple.300" } },
      },
      items: availableRoles,
    },
  };

  const orderedColumnIds = ["userRoles", "availableRoles"];

  return (
    <>
      <DnDBoardMain<RoleDnDItemProps>
        columnMap={columnMap}
        orderedColumnIds={orderedColumnIds}
        CardComponent={RoleDnDItem}
        enableColumnReorder={false}
        onColumnChange={handleColumnChange}
      />
      {/* <Button
        onClick={() =>
          updateUserRolesFromArray({ args: { publicId: "1", roleIds: [1, 2] } })
        }
      >
        Update User Roles
      </Button> */}
    </>
  );
}

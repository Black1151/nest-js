import { gql } from "@apollo/client";

export const GetUsersRolesAndPermissions = gql`
  query GetUsersRolesAndPermissions($data: UserPermissionsInput!) {
    getUsersRolesAndPermissions(data: $data) {
      permissions {
        id
        name
        createdAt
        updatedAt
      }
      roles {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

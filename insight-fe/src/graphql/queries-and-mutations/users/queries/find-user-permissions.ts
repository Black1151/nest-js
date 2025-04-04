import { gql } from "@apollo/client";

export const GET_USER_ROLES_AND_PERMISSIONS_QUERY = gql`
  query getUserRolesAndPermissions($data: UserPermissionsInput!) {
    userPermissions(data: $data) {
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

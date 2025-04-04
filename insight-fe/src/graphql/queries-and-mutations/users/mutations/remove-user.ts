import { gql } from "@apollo/client";

export const GET_USER_PERMISSIONS = gql`
  query userPermissions($publicId: String!) {
    userPermissions(data: { publicId: $publicId }) {
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

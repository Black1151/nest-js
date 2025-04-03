import { gql } from "@apollo/client";

export const CREATE_PERMISSION = gql`
  mutation CreatePermission($name: String!, $description: String!) {
    permissionCreate(data: { name: $name, description: $description }) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PERMISSION_MUTATION = gql`
  mutation UpdatePermission($id: Int!, $name: String!, $description: String!) {
    permissionUpdate(
      data: { id: $id, name: $name, description: $description }
    ) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PERMISSION_MUTATION = gql`
  mutation RemovePermission($id: Int!) {
    permissionRemove(data: { id: $id })
  }
`;

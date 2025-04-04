import { gql } from "@apollo/client";

export const UpdatePermission = gql`
  mutation UpdatePermission($id: Int!, $name: String!, $description: String!) {
    updatePermission(
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

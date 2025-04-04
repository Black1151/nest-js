import { gql } from "@apollo/client";

export const CreatePermission = gql`
  mutation CreatePermission($name: String!, $description: String!) {
    createPermission(data: { name: $name, description: $description }) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

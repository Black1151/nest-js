import { gql } from "@apollo/client";

export const DeletePermission = gql`
  mutation DeletePermission($id: Int!) {
    deletePermission(data: { id: $id })
  }
`;

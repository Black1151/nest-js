import { gql } from "@apollo/client";

export const RemoveUser = gql`
  mutation RemoveUser($publicId: String!) {
    removeUser(publicId: $publicId)
  }
`;

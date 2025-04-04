import { gql } from "@apollo/client";

export const REMOVE_ROLES_FROM_USER = gql`
  mutation removeRolesFromUser($publicId: String!, $roleIds: [Int!]!) {
    removeRolesFromUser(publicId: $publicId, roleIds: $roleIds) {
      id
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      addressLine1
      addressLine2
      city
      county
      country
      postalCode
      roles {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

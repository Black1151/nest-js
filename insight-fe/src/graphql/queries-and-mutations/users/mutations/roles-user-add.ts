import { gql } from "@apollo/client";

export const ADD_ROLES_TO_USER = gql`
  mutation addRolesToUser($publicId: String!, $roleIds: [Int!]!) {
    addRolesToUser(publicId: $publicId, roleIds: $roleIds) {
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

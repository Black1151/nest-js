import { gql } from "@apollo/client";

export const FIND_ALL_USERS_QUERY = gql`
  query findAllUsers($data: FindAllInput!) {
    usersFindAll(data: $data) {
      id
      publicId
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
        description
      }
      createdAt
      updatedAt
    }
  }
`;

import { gql } from "@apollo/client";

export const GetAllUsers = gql`
  query GetAllUsers($data: FindAllInput!) {
    getAllUsers(data: $data) {
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

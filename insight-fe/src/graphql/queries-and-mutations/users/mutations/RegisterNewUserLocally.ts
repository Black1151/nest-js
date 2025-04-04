import { gql } from "@apollo/client";

export const RegisterNewUserLocally = gql`
  mutation RegisterNewUserLocally($data: CreateUserDto!) {
    registerNewUserLocally(data: $data) {
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

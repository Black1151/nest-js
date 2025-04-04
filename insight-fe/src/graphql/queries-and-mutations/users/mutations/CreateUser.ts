// NB: This mutation is for admin panel only, for user facing registrations please use user.register

import { gql } from "@apollo/client";

export const CreateUser = gql`
  mutation CreateUser($data: CreateUserDto!) {
    createUser(data: $data) {
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
        description
      }
      createdAt
      updatedAt
    }
  }
`;

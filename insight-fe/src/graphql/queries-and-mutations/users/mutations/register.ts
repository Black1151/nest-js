import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation register($data: CreateUserDto!) {
    register(data: $data) {
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

import { gql } from "@apollo/client";

export const FindUserByPublicId = gql`
  query FindUserByPublicId($publicId: String!) {
    findUserByPublicId(publicId: $publicId) {
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

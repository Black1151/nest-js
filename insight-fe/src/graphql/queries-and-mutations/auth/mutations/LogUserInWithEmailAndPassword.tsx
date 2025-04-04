import { gql } from "@apollo/client";

export const LogUserInWithEmailAndPassword = gql`
  mutation LogUserInWithEmailAndPassword($data: LoginRequest!) {
    logUserInWithEmailAndPassword(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

import { gql } from "@apollo/client";

export const RefreshUsersTokens = gql`
  mutation RefreshUsersTokens($refreshToken: String!) {
    refreshUsersTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

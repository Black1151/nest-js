import { gql } from "@apollo/client";

export const GET_STYLE_COLLECTIONS = gql`
  query GetStyleCollections {
    getAllStyleCollection(data: { all: true }) {
      id
      name
    }
  }
`;

export const CREATE_STYLE = gql`
  mutation CreateStyle($data: CreateStyleInput!) {
    createStyle(data: $data) {
      id
      name
    }
  }
`;

export const GET_STYLES_WITH_CONFIG = gql`
  query GetStylesWithConfig($collectionId: String!, $element: String!) {
    getAllStyle(
      data: {
        all: true
        filters: [
          { column: "collectionId", value: $collectionId }
          { column: "element", value: $element }
        ]
      }
    ) {
      id
      name
      config
    }
  }
`;

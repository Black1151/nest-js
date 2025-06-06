import { gql } from "@apollo/client";

export const GET_STYLE_COLLECTIONS = gql`
  query GetStyleCollections {
    getAllStyleCollection(data: { all: true }) {
      id
      name
    }
  }
`;

export const GET_STYLE_GROUPS = gql`
  query GetStyleGroups($collectionId: String!, $element: String!) {
    getAllStyleGroup(
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

export const CREATE_STYLE_GROUP = gql`
  mutation CreateStyleGroup($data: CreateStyleGroupInput!) {
    createStyleGroup(data: $data) {
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

export const CREATE_LESSON = gql`
  mutation CreateLesson($data: CreateLessonInput!) {
    createLesson(data: $data) {
      id
    }
  }
`;

export const GET_LESSON = gql`
  query GetLesson($data: IdInput!) {
    getLesson(data: $data) {
      id
      title
      content
    }
  }
`;

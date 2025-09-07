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

export const UPDATE_STYLE = gql`
  mutation UpdateStyle($data: UpdateStyleInput!) {
    updateStyle(data: $data) {
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

export const UPDATE_STYLE_GROUP = gql`
  mutation UpdateStyleGroup($data: UpdateStyleGroupInput!) {
    updateStyleGroup(data: $data) {
      id
      name
    }
  }
`;

export const DELETE_STYLE_GROUP = gql`
  mutation DeleteStyleGroup($data: IdInput!) {
    deleteStyleGroup(data: $data)
  }
`;

export const CREATE_STYLE_COLLECTION = gql`
  mutation CreateStyleCollection($data: CreateStyleCollectionInput!) {
    createStyleCollection(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_STYLE_COLLECTION = gql`
  mutation UpdateStyleCollection($data: UpdateStyleCollectionInput!) {
    updateStyleCollection(data: $data) {
      id
      name
    }
  }
`;

export const DELETE_STYLE_COLLECTION = gql`
  mutation DeleteStyleCollection($data: IdInput!) {
    deleteStyleCollection(data: $data)
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

export const GET_STYLES_WITH_CONFIG_BY_GROUP = gql`
  query GetStylesWithConfigByGroup(
    $collectionId: String!
    $element: String!
    $groupId: String!
  ) {
    getAllStyle(
      data: {
        all: true
        filters: [
          { column: "collectionId", value: $collectionId }
          { column: "element", value: $element }
          { column: "groupId", value: $groupId }
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

export const UPDATE_LESSON = gql`
  mutation UpdateLesson($data: UpdateLessonInput!) {
    updateLesson(data: $data) {
      id
    }
  }
`;

export const GET_LESSON = gql`
  query GetLesson($data: IdInput!) {
    getLesson(data: $data) {
      id
      title
      themeId
      content
    }
  }
`;

export const GET_COLOR_PALETTES = gql`
  query GetColorPalettes($collectionId: String!) {
    getAllColorPalette(
      data: { all: true, filters: [{ column: "collectionId", value: $collectionId }] }
    ) {
      id
      name
      colors
    }
  }
`;

export const GET_COLOR_PALETTE = gql`
  query GetColorPalette($id: String!) {
    getColorPalette(data: { id: $id }) {
      id
      name
      colors
    }
  }
`;

export const CREATE_COLOR_PALETTE = gql`
  mutation CreateColorPalette($data: CreateColorPaletteInput!) {
    createColorPalette(data: $data) {
      id
      name
      colors
    }
  }
`;

export const UPDATE_COLOR_PALETTE = gql`
  mutation UpdateColorPalette($data: UpdateColorPaletteInput!) {
    updateColorPalette(data: $data) {
      id
      name
      colors
    }
  }
`;

export const DELETE_COLOR_PALETTE = gql`
  mutation DeleteColorPalette($data: IdInput!) {
    deleteColorPalette(data: $data)
  }
`;

export const GET_THEMES = gql`
  query GetThemes($collectionId: String!) {
    getAllTheme(
      data: {
        all: true
        filters: [{ column: "styleCollectionId", value: $collectionId }]
      }
    ) {
      id
      name
      styleCollectionId
      defaultPaletteId
    }
  }
`;

export const GET_ALL_THEMES = gql`
  query GetAllThemes {
    getAllTheme(data: { all: true }) {
      id
      name
      styleCollectionId
      defaultPaletteId
    }
  }
`;

export const GET_THEME = gql`
  query GetTheme($id: String!) {
    getTheme(data: { id: $id }) {
      id
      name
      styleCollectionId
      defaultPaletteId
    }
  }
`;

export const CREATE_THEME = gql`
  mutation CreateTheme($data: CreateThemeInput!) {
    createTheme(data: $data) {
      id
      name
      styleCollectionId
      defaultPaletteId
    }
  }
`;

export const UPDATE_THEME = gql`
  mutation UpdateTheme($data: UpdateThemeInput!) {
    updateTheme(data: $data) {
      id
      name
      styleCollectionId
      defaultPaletteId
    }
  }
`;

export const DELETE_THEME = gql`
  mutation DeleteTheme($data: IdInput!) {
    deleteTheme(data: $data)
  }
`;

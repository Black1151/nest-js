import { gql } from "@apollo/client";

export const CREATE_STYLE = gql`
  mutation CreateStyle($data: CreateStyleInput!) {
    createStyle(data: $data) {
      id
      name
    }
  }
`;

export const GET_STYLES_WITH_CONFIG = gql`
  query GetStylesWithConfig($themeId: String!, $element: String!) {
    getAllStyle(
      data: {
        all: true
        filters: [
          { column: "themeId", value: $themeId }
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
  query GetColorPalettes($themeId: String!) {
    getAllColorPalette(
      data: { all: true, filters: [{ column: "themeId", value: $themeId }] }
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

export const GET_ALL_THEMES = gql`
  query GetAllThemes {
    getAllTheme(data: { all: true }) {
      id
      name
      defaultPaletteId
    }
  }
`;

export const GET_THEME = gql`
  query GetTheme($id: String!) {
    getTheme(data: { id: $id }) {
      id
      name
      defaultPaletteId
    }
  }
`;

export const CREATE_THEME = gql`
  mutation CreateTheme($data: CreateThemeInput!) {
    createTheme(data: $data) {
      id
      name
      defaultPaletteId
    }
  }
`;

export const UPDATE_THEME = gql`
  mutation UpdateTheme($data: UpdateThemeInput!) {
    updateTheme(data: $data) {
      id
      name
      defaultPaletteId
    }
  }
`;

export const DELETE_THEME = gql`
  mutation DeleteTheme($data: IdInput!) {
    deleteTheme(data: $data)
  }
`;

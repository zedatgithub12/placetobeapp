import { DefaultTheme } from "@react-navigation/native";

export const theme = {
  ...DefaultTheme,
  theme: {
    ...DefaultTheme.colors,
    background: {
      main: "#ffffff",
      faded: "#f3f3f3",

      50: "#ffffff",
      100: "#efefef",
      200: "#dcdcdc",
      300: "#bdbdbd",
      400: "#989898",
      500: "#7c7c7c",
      600: "#656565",
      700: "#525252",
      800: "#464646",
      900: "#3d3d3d",
      950: "#292929",
    },
    primary: {
      50: "#fffeea",
      100: "#fffac5",
      200: "#fff685",
      light: "#FFF5DA",
      regular: "#ffdb1b",
      main: "#ffbb00",
      600: "#e29000",
      700: "#bb6502",
      800: "#984e08",
      900: "#7c400b",
      950: "#482100",
    },
    buttons: {
      main: "#0075FF",
    },
    success: {
      main: "#5cb85c",
    },
    info: {
      main: "#5bc0de",
    },
    warning: {
      main: "#f0ad4e",
    },
    danger: {
      main: "#d9534f",
    },
    dark: {
      50: "#f7f7f7",
      100: "#e3e3e3",
      200: "#c8c8c8",
      light: "#a4a4a4",
      400: "#818181",
      main: "#292b2c",
      600: "#515151",
      700: "#434343",
      800: "#383838",
      900: "#313131",
      950: "#000000",
    },
  },
};

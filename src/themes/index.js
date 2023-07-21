import { DefaultTheme } from "@react-navigation/native";

export const theme = {
  ...DefaultTheme,
  theme: {
    ...DefaultTheme.colors,
    background: {
      main: "#ffffff",
      faded: "#f3f3f3",
    },
    primary: {
      50: "#fffeea",
      100: "#fffac5",
      200: "#fff685",
      300: "#ffea46",
      400: "#ffdb1b",
      main: "#ffbb00",
      600: "#e29000",
      700: "#bb6502",
      800: "#984e08",
      900: "#7c400b",
      950: "#482100",
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
      main: "#292b2c",
    },
  },
};

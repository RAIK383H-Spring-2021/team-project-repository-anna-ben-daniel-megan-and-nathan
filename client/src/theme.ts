import { DefaultTheme } from "react-jss";

interface ThemeColor {
  base: string;
  light: string;
  dark: string;
}

interface TextColor {
  primary: string;
  secondary: string;
}

export interface AppTheme extends DefaultTheme {
  colors: {
    primary: ThemeColor;
    secondary: ThemeColor;
    accent: ThemeColor;
    error: string;
    warning: string;
    background: string;
    divider: string;
    text: TextColor;
  };
  transitions: {
    timing: {
      short: string;
      normal: string;
      long: string;
    };
    easing: {
      default: string;
    };
  };
}

const baseColors = {
  primary: {
    base: "#1F57C3",
    light: "#6798F8",
    dark: "#083282",
  },
  secondary: {
    base: "#32746D",
    light: "#7BB4AE",
    dark: "#12443F",
  },
  accent: {
    base: "#93E5AB",
    light: "#B7FFCC",
    dark: "#4BB169",
  },
  error: "#D62F43",
  warning: "#F7C44C",
};

const transitions = {
  timing: {
    short: "100ms",
    normal: "260ms",
    long: "600ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  },
};

export const light: AppTheme = {
  colors: {
    ...baseColors,
    background: "white",
    divider: "#C4C4C4",
    text: {
      primary: "rgba(0, 0, 0, 0.9)",
      secondary: "rgba(0, 0, 0, 0.55)",
    },
  },
  transitions,
};

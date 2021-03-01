import { DefaultTheme } from "react-jss";

const textColors = {
  light: {
    primary: "rgba(0, 0, 0, 0.9)",
    secondary: "rgba(0, 0, 0, 0.55)",
  },
  dark: {
    primary: "rgba(255, 255, 255, 0.9)",
    secondary: "rgba(255, 255, 255, 0.55)",
  },
};

interface ColorScheme {
  backgroundColor: string;
  color: string;
}

interface ThemeColor {
  base: ColorScheme;
  light?: ColorScheme;
  dark?: ColorScheme;
}

interface TypographyStyle {
  fontFamily: string;
  lineHeight: string;
  fontSize: string;
  color: string;
  fontWeight?:
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | "bold"
    | "normal"
    | (number & {})
    | "bolder"
    | "lighter";
  letterSpacing?: string;
  textTransform?:
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | "none"
    | "capitalize"
    | "full-size-kana"
    | "full-width"
    | "lowercase"
    | "uppercase";
}

export interface AppTheme extends DefaultTheme {
  colors: {
    primary: ThemeColor;
    secondary: ThemeColor;
    accent: ThemeColor;
    error: ThemeColor;
    warning: ThemeColor;
    background: ThemeColor;
    divider: ThemeColor;

    [key: string]: ThemeColor;
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
  typography: {
    [name: string]: TypographyStyle;
  };
}

const baseColors = {
  primary: {
    base: {
      backgroundColor: "#1F57C3",
      color: textColors.dark.primary,
    },
    light: {
      backgroundColor: "#6798F8",
      color: textColors.light.primary,
    },
    dark: {
      backgroundColor: "#083282",
      color: textColors.dark.primary,
    },
  },
  secondary: {
    base: {
      backgroundColor: "#32746D",
      color: textColors.dark.primary,
    },
    light: {
      backgroundColor: "#7BB4AE",
      color: textColors.light.primary,
    },
    dark: {
      backgroundColor: "#12443F",
      color: textColors.dark.primary,
    },
  },
  accent: {
    base: {
      backgroundColor: "#93E5AB",
      color: textColors.light.primary,
    },
    light: {
      backgroundColor: "#B7FFCC",
      color: textColors.light.primary,
    },
    dark: {
      backgroundColor: "#4BB169",
      color: textColors.light.primary,
    },
  },
  error: {
    base: {
      backgroundColor: "#D62F43",
      color: textColors.dark.primary,
    },
  },
  warning: {
    base: {
      backgroundColor: "#F7C44C",
      color: textColors.light.primary,
    },
  },
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

const typography: { [name: string]: TypographyStyle } = {
  heading: {
    color: "black",
    fontFamily: "Questrial",
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: "normal",
  },
  subheading: {
    color: "black",
    fontFamily: "Questrial",
    fontSize: "18px",
    lineHeight: "20px",
    fontWeight: "normal",
  },
  body: {
    color: "black",
    fontFamily: "Questrial",
    fontSize: "14px",
    lineHeight: "18px",
  },
  caption: {
    color: "black",
    fontFamily: "Questrial",
    fontSize: "10px",
    lineHeight: "12px",
  },
  button: {
    color: "black",
    fontFamily: "DM Sans",
    fontSize: "10px",
    fontWeight: "bold",
    lineHeight: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  preTitle: {
    color: "black",
    fontFamily: "Questrial",
    fontSize: "10px",
    lineHeight: "10px",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
  },
};

export const light: AppTheme = {
  colors: {
    ...baseColors,
    background: {
      base: {
        backgroundColor: "white",
        color: textColors.light.primary,
      },
    },
    divider: {
      base: {
        backgroundColor: "#C4C4C4",
        color: "#C4C4C4",
      },
    },
  },
  transitions,
  typography,
};

export const dark: AppTheme = {
  colors: {
    ...baseColors,
    background: {
      base: {
        backgroundColor: "black",
        color: textColors.dark.primary,
      },
    },
    divider: {
      base: {
        backgroundColor: "#505050",
        color: "#505050",
      },
    },
  },
  transitions,
  typography,
};

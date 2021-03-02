import { ThemeProvider } from "react-jss";
import { dark, light } from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  theme: {
    values: [
      { name: "light", value: light },
      { name: "dark", value: dark },
    ],
  },
};

const useDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;
const theme = useDarkTheme ? dark : light;

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

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

export const decorators = [
  (Story) => (
    <ThemeProvider theme={light}>
      <Story />
    </ThemeProvider>
  ),
];

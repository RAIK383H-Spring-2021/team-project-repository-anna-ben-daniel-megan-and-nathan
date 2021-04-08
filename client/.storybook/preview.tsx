import { ThemeProvider } from "react-jss";
import { light } from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  theme: {
    values: [{ name: "light", value: light }],
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={light}>
      <Story />
    </ThemeProvider>
  ),
];

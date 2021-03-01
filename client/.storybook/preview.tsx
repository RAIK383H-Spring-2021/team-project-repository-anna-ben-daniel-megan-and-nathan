import { ThemeProvider } from "react-jss";
import { dark, light } from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={dark}>
      <Story />
    </ThemeProvider>
  ),
];

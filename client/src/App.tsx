import React from "react";
import { ThemeProvider } from "react-jss";
import { SignUpPage } from "./pages/SignUpPage";
import { light, dark } from "./theme";

const useDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;
const theme = useDarkTheme ? dark : light;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SignUpPage />
    </ThemeProvider>
  );
}

export default App;

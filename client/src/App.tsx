import React from "react";
import { ThemeProvider } from "react-jss";
import { SignUpPage } from "./pages/SignUpPage";
import { light } from "./theme";

function App() {
  return (
    <ThemeProvider theme={light}>
      <SignUpPage />
    </ThemeProvider>
  );
}

export default App;

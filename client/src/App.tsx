import React from "react";
import { ThemeProvider } from "react-jss";
import { light } from "./theme";

function App() {
  return (
    <ThemeProvider theme={light}>
      <div>Hello, world.</div>
    </ThemeProvider>
  );
}

export default App;

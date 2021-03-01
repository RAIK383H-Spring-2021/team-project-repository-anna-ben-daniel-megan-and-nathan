import React from "react";
import { ThemeProvider } from "react-jss";
import { light } from "./theme";

function App() {
  return (
    <ThemeProvider theme={light}>
      <div style={{ ...light.typography.heading }}>Hello, world.</div>
    </ThemeProvider>
  );
}

export default App;

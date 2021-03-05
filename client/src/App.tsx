import React from "react";
import { ThemeProvider } from "react-jss";
import { SignUpPage } from "./pages/SignUpPage";
import { LogInPage } from "./pages/LogInPage";
import { LandingPage } from "./pages/LandingPage";
import { light, dark } from "./theme";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const systemDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;
const userTheme = localStorage.getItem("theme");

function determineTheme() {
  if (userTheme) {
    return userTheme === "dark" ? dark : light;
  }

  return systemDarkTheme ? dark : light;
}

const theme = determineTheme();

function Content() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={1000}>
        <Switch location={location}>
          <Route path="/login">
            <LogInPage />
          </Route>
          <Route path="/register">
            <SignUpPage />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Content />
      </Router>
    </ThemeProvider>
  );
}

export default App;

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
import { DashboardPage } from "./pages/DashboardPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { CreateEventPage } from "./pages/CreateEventPage";

function determineTheme() {
  const systemDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;
  const userTheme = localStorage.getItem("theme");

  if (userTheme) {
    return userTheme === "dark" ? dark : light;
  }

  return systemDarkTheme ? dark : light;
}

const theme = determineTheme();
document.body.classList.add(theme.name);

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
          <Route path="/dash">
            <DashboardPage />
          </Route>
          <Route path="/events/:event_id">
            <EventDetailsPage />
          </Route>
          <Route path="/create">
            <CreateEventPage />
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

import React, { lazy, ReactNode, Suspense } from "react";
import { ThemeProvider, useTheme } from "react-jss";
// import SignUpPage from "./pages/SignUpPage";
// import LogInPage from "./pages/LogInPage";
// import { LandingPage } from "./pages/LandingPage";
import { light, dark, AppTheme } from "./theme";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// import { DashboardPage } from "./pages/DashboardPage";
// import { EventDetailsPage } from "./pages/EventDetailsPage";
// import { CreateEventPage } from "./pages/CreateEventPage";
// import MDSpinner from "react-md-spinner";

const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LogInPage = lazy(() => import("./pages/LogInPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EventDetailsPage = lazy(() => import("./pages/EventDetailsPage"));
const CreateEventPage = lazy(() => import("./pages/CreateEventPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

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
      <CSSTransition key={location.key} classNames="fade" timeout={500}>
        <Switch location={location}>
          <Route path="/login">
            <Page>
              <LogInPage />
            </Page>
          </Route>
          <Route path="/register">
            <Page>
              <SignUpPage />
            </Page>
          </Route>
          <Route path="/dash/:tab">
            <Page>
              <DashboardPage />
            </Page>
          </Route>
          <Route path="/dash">
            <Page>
              <DashboardPage />
            </Page>
          </Route>
          <Route path="/events/:event_id">
            <Page>
              <EventDetailsPage />
            </Page>
          </Route>
          <Route path="/create">
            <Page>
              <CreateEventPage />
            </Page>
          </Route>
          <Route exact path="/">
            <Page>
              <LandingPage />
            </Page>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}

function PageFallback() {
  const theme = useTheme<AppTheme>();

  return (
    <div
      style={{
        display: "grid",
        height: "100%",
        width: "100%",
        placeItems: "center",
        backgroundColor: theme.colors.background.base.backgroundColor,
      }}
    >
      {/* <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} /> */}
    </div>
  );
}

function Page({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Suspense fallback={<PageFallback />}>
        <div style={{ animation: "fade-in 100ms linear" }}>{children}</div>
      </Suspense>
    </div>
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

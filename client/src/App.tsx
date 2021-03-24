import { lazy, ReactNode, Suspense } from "react";
import { createUseStyles, ThemeProvider, useTheme } from "react-jss";
import { GuardProvider, GuardedRoute } from "react-router-guards";
import { light, dark, AppTheme, useThemeListener } from "./theme";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MDSpinner from "react-md-spinner";
import { GuardFunction } from "react-router-guards/dist/types";
import { User } from "./User";

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

const requireAuth: GuardFunction = (to, from, next) => {
  if (to.meta.auth) {
    if (User.getUser()) {
      next();
    }

    next.redirect("/login");
  } else {
    next();
  }
};

function Content() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={500}>
        <GuardProvider guards={[requireAuth]}>
          <Switch location={location}>
            <Route exact path="/login">
              <Page>
                <LogInPage />
              </Page>
            </Route>
            <Route exact path="/register">
              <Page>
                <SignUpPage />
              </Page>
            </Route>
            <GuardedRoute path="/dash/:tab" meta={{ auth: true }}>
              <Page>
                <DashboardPage />
              </Page>
            </GuardedRoute>
            <GuardedRoute path="/dash" meta={{ auth: true }}>
              <Page>
                <DashboardPage />
              </Page>
            </GuardedRoute>
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
        </GuardProvider>
      </CSSTransition>
    </TransitionGroup>
  );
}

const usePageFallbackStyles = createUseStyles({
  spinner: {
    opacity: 0,
    animationName: "fade-in",
    animationDelay: 1200,
    animationFillMode: "forwards",
    animationDuration: 600,
    animationTimingFunction: "linear",
    zIndex: 1,
  },
});

function PageFallback() {
  const theme = useTheme<AppTheme>();
  const classes = usePageFallbackStyles();

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
      <div className={classes.spinner}>
        <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
      </div>
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
  const theme = useThemeListener();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Content />
      </Router>
    </ThemeProvider>
  );
}

export default App;

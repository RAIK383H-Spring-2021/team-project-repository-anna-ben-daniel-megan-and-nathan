import { lazy, ReactNode, Suspense, useState } from "react";
import { createUseStyles, ThemeProvider, useTheme } from "react-jss";
import { light, dark, AppTheme, useThemeListener } from "./theme";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MDSpinner from "react-md-spinner";
import { User } from "./User";
import { Guard } from "./components/Guard";
import { useOffline } from "./hooks/useOffline";
import { Dialog } from "./components/Dialog";
import { Toolbar } from "./components/Toolbar";
import { IconButton } from "./components/IconButton";
import { Button } from "./components/Button";
import { UserProfile } from "./pages/UserProfile";

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

const requireAuth = () => {
  if (User.user) {
    if (!navigator.onLine) {
      return true;
    }
    return new Promise<boolean | string>(async (resolve, reject) => {
      const authorized = await User.isAuthorized;
      if (authorized) resolve(true);
      else resolve("/login");
    });
  } else {
    return "/login";
  }
};

function Content() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={500}>
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
          <Route path="/dash/:tab">
            <Page>
              <DashboardPage />
            </Page>
          </Route>
          <Route path="/dash">
            <Guard fallback={<PageFallback />} canActivate={requireAuth}>
              <Page>
                <DashboardPage />
              </Page>
            </Guard>
          </Route>
          <Route path="/events/:event_id">
            <Guard fallback={<PageFallback />} canActivate={requireAuth}>
              <Page>
                <EventDetailsPage />
              </Page>
            </Guard>
          </Route>
          <Route exact path="/events">
            <Redirect to="/dash" />
          </Route>
          <Route path="/create">
            <Guard fallback={<PageFallback />} canActivate={requireAuth}>
              <Page>
                <CreateEventPage />
              </Page>
            </Guard>
          </Route>
          <Route path="/profile">
            <Guard fallback={<PageFallback />} canActivate={requireAuth}>
              <Page>
                <UserProfile />
              </Page>
            </Guard>
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
        position: "absolute",
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
  const offline = useOffline();
  const [showoff, setShowoff] = useState(
    !localStorage.getItem("shownOfflineDialog")
  );

  if (offline) {
    localStorage.setItem("shownOfflineDialog", "true");
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Content />
      </Router>
      {offline && (
        <Dialog open={showoff}>
          <Toolbar
            title="You're offline!"
            end={<IconButton icon="close" onClick={() => setShowoff(false)} />}
          />
          <p
            style={{
              margin: "12px 24px",
              fontSize: "18px",
              lineHeight: "26px",
            }}
          >
            You can still use Shindig while you're offline, however:
          </p>
          <ul
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              margin: "12px 24px",
            }}
          >
            <li>You cannot create events.</li>
            <li>You cannot see new invitations.</li>
            <li>You cannot update your profile or questionnaire.</li>
          </ul>
          <p
            style={{
              margin: "12px 24px",
              fontSize: "18px",
              lineHeight: "26px",
            }}
          >
            While you're offline, you will see{" "}
            <span
              style={{
                fontSize: "18px",
                padding: "0 2px",
                transform: "translateY(3px)",
              }}
              className="material-icons"
            >
              cloud_off
            </span>{" "}
            at the top left of the dashboard.
          </p>
          <div
            style={{
              display: "flex",
              margin: "48px 24px 12px 24px",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => setShowoff(false)} color="accent">
              OK
            </Button>
          </div>
        </Dialog>
      )}
    </ThemeProvider>
  );
}

export default App;

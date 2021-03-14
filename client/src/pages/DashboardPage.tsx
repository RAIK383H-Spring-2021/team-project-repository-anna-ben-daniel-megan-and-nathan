import { FC, useState } from "react";
import { useHistory } from "react-router";
import { createUseStyles, useTheme } from "react-jss";
import { Redirect, useParams } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Background } from "../components/Background";
import { Content } from "../components/Content";
import { EventList } from "../components/EventList";
import { FAB } from "../components/FAB";
import { IconButton } from "../components/IconButton";
import { TabBar } from "../components/TabBar";
import { Toolbar } from "../components/Toolbar";
import { useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import {
  getUserInvitations,
  UserInvitationsResponse,
  UserCreatedEventsResponse,
  getUserCreatedEvents,
} from "../resources/dashboard";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  tabBar: {
    position: "absolute",
    top: 75,
    width: "100%",
  },
  smallContent: {
    position: "relative",
    height: "100%",
    overflowX: "hidden",
  },
  mobileCreatedTab: ({ initial }) => ({
    position: "absolute",
    height: "100%",
    overflowY: "auto",
    paddingBottom: 96,
    paddingTop: 150,
    width: "100%",
    transitionDuration: theme.transitions.timing.normal,
    transitionTimingFunction: theme.transitions.easing.default,
    transform: initial === "invited" && "translateX(-100vw)",

    "&.slide-enter": {
      transform: "translateX(-100vw)",
    },

    "&.slide-enter-done": {
      transform: "translateX(0)",
    },

    "&.slide-enter-active": {
      transform: "translateX(0)",
    },

    "&.slide-exit-done": {
      transform: "translateX(-100vw)",
      display: "none",
    },

    "&.slide-exit-active": {
      transform: "translateX(-100vw)",
    },
  }),
  mobileInvitedTab: ({ initial }) => ({
    position: "absolute",
    height: "100%",
    overflowY: "auto",
    paddingBottom: 96,
    paddingTop: 150,
    width: "100%",
    transitionDuration: theme.transitions.timing.normal,
    transitionTimingFunction: theme.transitions.easing.default,
    transform: initial === "created" && "translateX(100vw)",

    "&.slide-enter": {
      transform: "translateX(100vw)",
    },

    "&.slide-enter-done": {
      transform: "translateX(0)",
    },

    "&.slide-enter-active": {
      transform: "translateX(0)",
    },

    "&.slide-exit-done": {
      transform: "translateX(100vw)",
      display: "none",
    },

    "&.slide-exit-active": {
      transform: "translateX(100vw)",
    },
  }),
  mobileTransitionWrapper: {
    height: "100%",
  },
  desktopPageWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    height: "100%",
    padding: "96px 180px 0 180px",
    columnGap: 60,
    overflowY: "auto",

    "& > div": {
      paddingBottom: 50,
    },
  },
  desktopBackground: {
    position: "absolute",
    bottom: -400,
    left: -400,
    display: "inline",
    zIndex: -1,
    width: 1000,
    height: 1000,
  },
}));

export const DashboardPage: FC = (props) => {
  const size = useScreen();

  return size === "large" ? <DashboardLarge /> : <DashboardSmall />;
};

function DashboardLarge() {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const { tab } = useParams<{ tab: string }>();
  const history = useHistory();

  if (tab) {
    return <Redirect to="/dash" />;
  }

  return (
    <Content
      toolbar={
        <Toolbar
          title="Dashboard"
          size="large"
          end={
            <IconButton
              icon="account_circle"
              onClick={() =>
                localStorage.getItem("debug") === "debug"
                  ? localStorage.removeItem("debug")
                  : localStorage.setItem("debug", "debug")
              }
            />
          }
        />
      }
      fab={<FAB icon="add" onClick={() => history.push(`/create`)} />}
    >
      <div className={classes.desktopPageWrapper}>
        <div>
          <CreatedEventsTab type="contain" />
        </div>
        <div>
          <InvitationsTab type="contain" />
        </div>
      </div>
      <Background className={classes.desktopBackground} />
    </Content>
  );
}

function DashboardSmall() {
  const params = useParams<{ tab: string }>();
  const initial = params.tab || "created";
  const history = useHistory();
  const [current, setCurrent] = useState(initial);

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, initial });

  function setTab(t: string) {
    setCurrent(t);
    // history.replace(`/dash/${t}`);
    setTimeout(() => {
      window.history.replaceState(null, t, `/dash/${t}`);
    }, 500);
  }

  const tabs = [
    { key: "created", label: "Created" },
    { key: "invited", label: "Invited" },
  ];

  return (
    <Content
      toolbar={
        <div>
          <Toolbar
            title="Dashboard"
            end={
              <IconButton
                icon="account_circle"
                onClick={() =>
                  localStorage.getItem("debug") === "debug"
                    ? localStorage.removeItem("debug")
                    : localStorage.setItem("debug", "debug")
                }
              />
            }
          />
          <TabBar
            tabs={tabs}
            color="primary"
            onChange={setTab}
            current={current}
          />
        </div>
      }
      fab={<FAB icon="add" onClick={() => history.push(`/create`)} />}
    >
      <TransitionGroup className={classes.mobileTransitionWrapper}>
        <div className={classes.smallContent}>
          <CSSTransition
            in={current === "created"}
            timeout={500}
            classNames="slide"
          >
            <div className={classes.mobileCreatedTab}>
              <CreatedEventsTab type="fill" />
            </div>
          </CSSTransition>
          <CSSTransition
            in={current === "invited"}
            timeout={500}
            classNames="slide"
          >
            <div className={classes.mobileInvitedTab}>
              <InvitationsTab type="fill" />
            </div>
          </CSSTransition>
        </div>
      </TransitionGroup>
    </Content>
  );
}

function CreatedEventsTab({ type: style }: { type: "fill" | "contain" }) {
  const [response, isLoading] = useRequest<UserCreatedEventsResponse>(
    getUserCreatedEvents,
    14
  );

  return (
    <div>
      <EventList
        style={style}
        events={response?.events ?? []}
        loading={isLoading}
        title="Your Events"
        info={["invitees", "date"]}
      ></EventList>
    </div>
  );
}

function InvitationsTab({ type: style }: { type: "fill" | "contain" }) {
  const [response, isLoading] = useRequest<UserInvitationsResponse>(
    getUserInvitations,
    14
  );

  return (
    <div>
      <EventList
        style={style}
        events={response?.newEvents ?? []}
        loading={isLoading}
        title="New Events"
        info={["creator", "date"]}
      ></EventList>
      <EventList
        style={style}
        events={response?.updatedEvents ?? []}
        loading={isLoading}
        title="Updated Events"
        info={["creator", "date"]}
      ></EventList>
      <EventList
        style={style}
        events={response?.otherEvents ?? []}
        loading={isLoading}
        title="Other Events"
        info={["creator", "date"]}
      ></EventList>
    </div>
  );
}

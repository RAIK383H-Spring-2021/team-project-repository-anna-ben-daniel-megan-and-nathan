import { FC, Fragment, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Content } from "../components/Content";
import { FAB } from "../components/FAB";
import { IconButton } from "../components/IconButton";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { MiniScore } from "../components/MiniScore";
import { TabBar } from "../components/TabBar";
import { Toolbar } from "../components/Toolbar";
import { useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import {
  getUserInvitations,
  UserInvitationsResponse,
  Event,
  UserCreatedEventsResponse,
  getUserCreatedEvents,
} from "../resources/dashboard";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  sectionHeader: {
    ...theme.typography.preTitle,
    marginTop: 32,
    marginLeft: 28,
    marginBottom: 12,
  },
  tabBar: {
    position: "absolute",
    top: 75,
    width: "100%",
  },
  smallContent: {
    marginTop: 0,
  },
}));

export const DashboardPage: FC = (props) => {
  const size = useScreen();

  return size === "large" ? <DashboardLarge /> : <DashboardSmall />;
};

function DashboardLarge() {
  return (
    <Content>
      <div>
        <CreatedEventsTab />
      </div>
      <div>
        <InvitationsTab />
      </div>
    </Content>
  );
}

function DashboardSmall() {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const [current, setCurrent] = useState("created");
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
          <TabBar tabs={tabs} color="primary" onChange={setCurrent} />
        </div>
      }
      fab={<FAB icon="add" />}
    >
      <div className={classes.smallContent}>
        {current === "created" && <CreatedEventsTab />}
        {current === "invited" && <InvitationsTab />}
      </div>
    </Content>
  );
}

function CreatedEventsTab() {
  const [response, isLoading] = useRequest<UserCreatedEventsResponse>(
    getUserCreatedEvents,
    14
  );

  return (
    <div>
      <EventList
        events={response?.events ?? []}
        loading={isLoading}
        title="Your Events"
      ></EventList>
    </div>
  );
}

function InvitationsTab() {
  const [response, isLoading] = useRequest<UserInvitationsResponse>(
    getUserInvitations,
    14
  );

  return (
    <div>
      <EventList
        events={response?.newEvents ?? []}
        loading={isLoading}
        title="New Events"
      ></EventList>
      <EventList
        events={response?.updatedEvents ?? []}
        loading={isLoading}
        title="Updated Events"
      ></EventList>
      <EventList
        events={response?.otherEvents ?? []}
        loading={isLoading}
        title="Other Events"
      ></EventList>
    </div>
  );
}

function EventList(props: {
  events: Event[];
  title: string;
  loading: boolean;
}) {
  const { events, title, loading } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  if (events.length < 1) {
    return null;
  }

  return (
    <Fragment>
      <h2 className={classes.sectionHeader}>{title}</h2>
      {loading ? (
        "Loading..."
      ) : (
        <List type="fill">
          {events.map((event, i) => {
            if (event.status === "complete") {
              return (
                <ListItem
                  key={i}
                  button={true}
                  start={<MiniScore value={event.score} type="score" />}
                  subtitle={truncateDescription(event.description)}
                >
                  {event.title}
                </ListItem>
              );
            }
            return (
              <ListItem
                key={i}
                button={true}
                subtitle={truncateDescription(event.description)}
                start={
                  <MiniScore
                    value={event.replies}
                    max={event.invitees}
                    type="responses"
                  />
                }
              >
                {event.title}
              </ListItem>
            );
          })}
        </List>
      )}
    </Fragment>
  );
}

function truncateDescription(description: string) {
  const trimmed = description.replace(/[\n\r]+/g, " ").trim();
  if (trimmed.length > 70) {
    return trimmed.slice(0, 100) + "...";
  } else return trimmed;
}

import { FC, Fragment, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Content } from "../components/Content";
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
} from "../resources/dashboard";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  sectionHeader: {
    ...theme.typography.preTitle,
    marginTop: 48,
    marginLeft: 28,
    marginBottom: 12,
  },
  tabBar: {
    position: "absolute",
    top: 75,
    width: "100%",
  },
  smallContent: {
    marginTop: 72,
  },
}));

export const DashboardPage: FC = (props) => {
  // const theme = useTheme<AppTheme>();
  // const classes = useStyles({ theme });
  const size = useScreen();

  return (
    <Content toolbar={<Toolbar title="Dashboard" />}>
      {size === "large" ? <DashboardLarge /> : <DashboardSmall />}
    </Content>
  );
};

function DashboardLarge() {
  return (
    <Fragment>
      <div>
        <h2>Your Events</h2>
        <List type="contain">
          <ListItem>Event Name</ListItem>
          <ListItem>Event Name</ListItem>
          <ListItem>Event Name</ListItem>
        </List>
      </div>
      <div>
        <InvitationsTab />
      </div>
    </Fragment>
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
    <Fragment>
      <TabBar
        className={classes.tabBar}
        tabs={tabs}
        color="primary"
        onChange={setCurrent}
      />
      <div className={classes.smallContent}>
        {current === "created" && <div>Your Events</div>}
        {current === "invited" && <InvitationsTab />}
      </div>
    </Fragment>
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

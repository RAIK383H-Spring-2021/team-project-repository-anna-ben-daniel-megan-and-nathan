import { createUseStyles } from "react-jss";
import { useHistory, useParams } from "react-router";
import { useTheme } from "theming";
import { Background } from "../components/Background";
import { Card } from "../components/Card";
import { Content } from "../components/Content";
import { IconButton } from "../components/IconButton";
import { InfoBlock } from "../components/InfoBlock";
import { Score } from "../components/Score";
import { Toolbar } from "../components/Toolbar";
import { useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import { Event } from "../resources/dashboard";
import { events } from "../resources/events";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  desktopWrapper: {
    ...theme.typography.body,
    marginTop: 180,
  },
  mobileWrapper: {
    ...theme.typography.body,
    marginTop: 120,
  },
  meterCenter: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  desktopBackground: {
    position: "absolute",
    bottom: -400,
    right: -400,
    display: "inline",
    zIndex: -1,
    width: 1000,
    height: 1000,
  },
  desktopGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "12px 180px 0 180px",
    columnGap: 60,
    overflowY: "auto",
  },
  detailsCard: {
    display: "grid",
    rowGap: 32,
  },
  detailsCardDoubleColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  cardLabel: {
    ...theme.typography.preTitle,
    paddingLeft: 4,
    paddingBottom: 12,
  },
}));

export function EventDetailsPage() {
  const screen = useScreen();
  const { event_id } = useParams<{ event_id: string }>();
  const [event] = useRequest<Event>(events.get, event_id);

  return screen === "large" ? (
    <EventDetailsLarge event={event ?? "loading"} />
  ) : (
    <EventDetailsSmall event={event ?? "loading"} />
  );
}

function EventDetailsLarge({ event }: { event: Event | "loading" }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  return (
    <Content
      toolbar={
        <Toolbar
          start={
            <IconButton
              icon="arrow_back"
              onClick={() => history.push("/dash")}
            />
          }
          size="large"
          title={event === "loading" ? "Loading..." : event.title}
        />
      }
    >
      {event !== "loading" && (
        <div className={classes.desktopWrapper}>
          <Meter event={event} />
          <div className={classes.desktopGrid}>
            <SummaryCard event={event} />
            <div>Right side</div>
          </div>
        </div>
      )}
      <Background className={classes.desktopBackground} />
    </Content>
  );
}

function EventDetailsSmall({ event }: { event: Event | "loading" }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  return (
    <Content
      toolbar={
        <Toolbar
          start={
            <IconButton
              icon="arrow_back"
              onClick={() => history.push("/dash")}
            />
          }
          end={<IconButton icon="more_vert" />}
          size="normal"
          title={event !== "loading" ? event.title : ""}
        />
      }
    >
      {event !== "loading" && (
        <div className={classes.mobileWrapper}>
          <Meter event={event} />
          <SummaryCard event={event} />
        </div>
      )}
    </Content>
  );
}

function Meter({ event }: { event: Event }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const type = event.status === "complete" ? "score" : "responses";
  const max = event.status === "complete" ? 5 : event.invitees;
  const score = event.status === "complete" ? event.score : event.replies;
  const label =
    event.status === "complete" ? "Comfort Score" : "Invitee Responses";

  return (
    <div className={classes.meterCenter}>
      <Score label={label} val={score} max={max} type={type} />
    </div>
  );
}

function SummaryCard({ event }: { event: Event }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const date = new Date(event.date_time);
  const screen = useScreen();

  return (
    <div>
      <h2 hidden={screen !== "large"} className={classes.cardLabel}>
        Details
      </h2>
      <Card
        color="background"
        borderless={screen !== "large"}
        className={classes.detailsCard}
      >
        <div className={classes.detailsCardDoubleColumn}>
          <InfoBlock icon="person" label="host" body={event.creator} />
          <InfoBlock icon="email" label="contact email" body={event.creator} />
        </div>
        <div className={classes.detailsCardDoubleColumn}>
          <InfoBlock
            icon="event"
            label="date"
            body={date.toLocaleDateString()}
          />
          <InfoBlock
            icon="schedule"
            label="time"
            body={date.toLocaleTimeString()}
          />
        </div>
        <InfoBlock icon="place" label="location" body={event.location} />
        <InfoBlock
          icon="subject"
          label="description"
          body={event.description}
          bodyType="p"
        />
      </Card>
    </div>
  );
}

// function EventSummaryPane() {}

// function EventComfortPane() {}

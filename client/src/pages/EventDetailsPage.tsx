import { FC, Fragment } from "react";
import { Helmet } from "react-helmet";
import { createUseStyles } from "react-jss";
import MDSpinner from "react-md-spinner";
import { useHistory, useParams } from "react-router";
import { useTheme } from "theming";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Content } from "../components/Content";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { InfoBlock } from "../components/InfoBlock";
import { MiniScore } from "../components/MiniScore";
import { Score } from "../components/Score";
import { Toolbar } from "../components/Toolbar";
import { useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import { Event, host_name } from "../models/Event";
import { events } from "../resources/events";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translateY(10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  desktopWrapper: {
    ...theme.typography.body,
    marginTop: 180,
    marginBottom: 96,
    animationName: "$slideIn",
    animationDuration: "375ms",
    animationTimingFunction: theme.transitions.easing.default,
  },
  mobileWrapper: {
    ...theme.typography.body,
    marginTop: 120,
    animationName: "$slideIn",
    animationDuration: "375ms",
    animationTimingFunction: theme.transitions.easing.default,
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
  loading: {
    marginTop: 120,
    height: 100,
    display: "grid",
    placeItems: "center",
  },
  sectionWrapper: {
    display: "flex",
    flexDirection: "column",
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
  questionnaireCard: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    margin: ({ screen }) => screen !== "large" && "12px 28px",
    padding: ({ screen }) => screen !== "large" && "20px 24px",
  },
  questionnaireActionText: {
    ...theme.typography.preTitle,
    color: theme.colors.primary.base.color,
  },
  questionnaireCallToAction: {
    ...theme.typography.body,
    color: theme.colors.primary.base.color,
    fontSize: ({ screen }) => (screen === "large" ? 28 : 18),
    lineHeight: ({ screen }) => (screen === "large" ? "34px" : "20px"),
    fontWeight: "normal",
    flex: "1",
  },
  placeContentsEnd: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  comfortMetricsCard: {
    flex: "1 1 auto",
    padding: 0,
  },
  desktopScoreItem: {
    display: "flex",
    margin: 36,
  },
  desktopScoreIcon: {
    marginRight: 24,
    flex: "0 0",
  },
  desktopScoreAside: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  desktopScoreExplanation: {
    color: theme.colors.background.light?.color,
  },
}));

const EventDetailsPage: FC = () => {
  const screen = useScreen();
  const { event_id } = useParams<{ event_id: string }>();
  const [response, isLoading] = useRequest<{ event: Event }>(
    events.get,
    event_id
  );

  return (
    <Fragment>
      <Helmet
        title={isLoading ? "Loading..." : response ? response.event.title : ""}
      />
      {screen === "large" ? (
        <EventDetailsLarge event={response?.event} loading={isLoading} />
      ) : (
        <EventDetailsSmall event={response?.event} loading={isLoading} />
      )}
    </Fragment>
  );
};

function EventDetailsLarge({
  event,
  loading,
}: {
  loading: boolean;
  event?: Event;
}) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  function goBack() {
    if (window.history.state?.state?.referrer) {
      if (window.history.state.state.referrer === "dashboard") {
        history.goBack();
        return;
      }
    }

    history.push("/dash");
  }

  return (
    <Content
      toolbar={
        <Toolbar
          start={<IconButton icon="arrow_back" onClick={goBack} />}
          size="large"
          title={event?.title ?? "Loading..."}
        />
      }
    >
      {event && (
        <div className={classes.desktopWrapper}>
          <Meter event={event} />
          <div className={classes.desktopGrid}>
            <SummarySection event={event} />
            <ComfortMetricSection event={event} />
          </div>
        </div>
      )}
      {loading && (
        <div className={classes.loading}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      )}
      <Background className={classes.desktopBackground} />
    </Content>
  );
}

function EventDetailsSmall({
  event,
  loading,
}: {
  loading: boolean;
  event?: Event;
}) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  function goBack() {
    if (window.history.state?.state?.referrer) {
      if (window.history.state.state.referrer === "dashboard") {
        history.goBack();
        return;
      }
    }

    history.push("/dash");
  }

  return (
    <Content
      toolbar={
        <Toolbar
          start={<IconButton icon="arrow_back" onClick={goBack} />}
          end={<IconButton icon="more_vert" />}
          size="normal"
          title={event?.title ?? "Loading..."}
        />
      }
    >
      {event && (
        <div className={classes.mobileWrapper}>
          <Meter event={event} />
          <ComfortMetricSection event={event} />
          <SummarySection event={event} />
        </div>
      )}
      {loading && (
        <div className={classes.loading}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      )}
    </Content>
  );
}

function Meter({ event }: { event: Event }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const complete = event.responses / event.invitees > 0.8;

  const type = complete ? "score" : "responses";
  const max = complete ? 5 : event.invitees;
  const score = complete ? event.score : event.responses;
  const label = complete ? "Comfort Score" : "Invitee Responses";

  return (
    <div className={classes.meterCenter}>
      <Score label={label} val={score} max={max} type={type} />
    </div>
  );
}

function SummarySection({ event }: { event: Event }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const date = new Date(event.date_time);
  const screen = useScreen();

  return (
    <section className={classes.sectionWrapper}>
      <h2 hidden={screen !== "large"} className={classes.cardLabel}>
        Details
      </h2>
      <Card
        color="background"
        borderless={screen !== "large"}
        className={classes.detailsCard}
      >
        <div className={classes.detailsCardDoubleColumn}>
          <InfoBlock icon="person" label="host" body={host_name(event)} />
          <InfoBlock
            icon="email"
            label="contact email"
            body={event.host_email}
          />
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
    </section>
  );
}

function ComfortMetricSection({ event }: { event: Event }) {
  const screen = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });
  const rand = Math.floor(Math.random() * 2);

  return (
    <section className={classes.sectionWrapper}>
      <h2 hidden={screen !== "large"} className={classes.cardLabel}>
        Comfort Metrics
      </h2>
      {rand > 1 ? <QuestionnaireCard /> : <ScoreDetailsCard />}
    </section>
  );
}

function QuestionnaireCard() {
  const screen = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });

  return (
    <Card color="primary" className={classes.questionnaireCard}>
      <small className={classes.questionnaireActionText}>ACTION</small>
      <h3 className={classes.questionnaireCallToAction}>
        Fill out your questionnaire to get your Comfort Score.
      </h3>
      <div className={classes.placeContentsEnd}>
        <Button
          color="primary"
          transparent={true}
          end={<Icon size="small" name="arrow_forward" />}
        >
          Respond Now
        </Button>
      </div>
    </Card>
  );
}

function ScoreDetailsCard() {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const screen = useScreen();

  if (screen === "large") {
    return (
      <Card
        color="background"
        borderless={screen !== "large"}
        className={classes.comfortMetricsCard}
      >
        <div className={classes.desktopScoreItem}>
          <div className={classes.desktopScoreIcon}>
            <MiniScore type="score" value={5} max={5} icon="nature_people" />
          </div>
          <div className={classes.desktopScoreAside}>
            <div>Outdoor Venue</div>
          </div>
        </div>
        <div className={classes.desktopScoreItem}>
          <div className={classes.desktopScoreIcon}>
            <MiniScore type="score" value={3} max={5} icon="masks" />
          </div>
          <div className={classes.desktopScoreAside}>
            <div>Masks required, 6-foot social distancing recommended.</div>
            <div className={classes.desktopScoreExplanation}>
              You prefer social distancing to be required.
            </div>
          </div>
        </div>
        <div className={classes.desktopScoreItem}>
          <div className={classes.desktopScoreIcon}>
            <MiniScore type="score" value={1} max={5} icon="restaurant_menu" />
          </div>
          <div className={classes.desktopScoreAside}>
            <div>Food will be served buffet-style.</div>
            <div className={classes.desktopScoreExplanation}>
              You prefer food to be pre-packaged.
            </div>
          </div>
        </div>
        <div className={classes.desktopScoreItem}>
          <div className={classes.desktopScoreIcon}>
            <MiniScore type="score" value={5} max={5} icon="people" />
          </div>
          <div className={classes.desktopScoreAside}>
            <div>There are 23 invitees.</div>
          </div>
        </div>
      </Card>
    );
  } else {
    return <Icon name="person" />;
  }
}

// function SuggestionsCard() {}

export default EventDetailsPage;

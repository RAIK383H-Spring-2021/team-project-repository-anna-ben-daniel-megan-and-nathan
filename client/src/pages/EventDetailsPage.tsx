import { FC, Fragment, useState } from "react";
import { Helmet } from "react-helmet";
import { createUseStyles } from "react-jss";
import MDSpinner from "react-md-spinner";
import { useHistory, useParams } from "react-router";
import { useTheme } from "theming";
import { API } from "../api";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Content } from "../components/Content";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { InfoBlock } from "../components/InfoBlock";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { MiniScore } from "../components/MiniScore";
import { Score } from "../components/Score";
import { Toolbar } from "../components/Toolbar";
import { useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import { publish, useSubscription } from "../hooks/useSubscription";
import { Event, host_name } from "../models/Event";
import { events } from "../resources/events";
import { AppTheme } from "../theme";
import { User } from "../User";
import { IQuestionnaire, Questionnaire } from "./partials/Questionnaire";

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
    display: "flex",
    flexDirection: "column",
  },
  desktopScoreItem: {
    display: "flex",
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
  separator: {
    flexGrow: 1,
    flexShrink: 0,
    height: 24,
  },
}));

const EventDetailsPage: FC = () => {
  const screen = useScreen();
  const { event_id } = useParams<{ event_id: string }>();
  const [response, isLoading, makeRequest] = useRequest<{ event: Event }>(
    events.get,
    event_id
  );

  useSubscription<void>("event_update", () => makeRequest(event_id));

  return (
    <Fragment>
      <Helmet
        title={
          isLoading
            ? "Loading..."
            : response
              ? response?.event?.title ?? "Loading..."
              : "Loading..."
        }
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
          background="filled"
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
  const host = event.host_id === User.user?.id ?? 0;

  const type = host ? (complete ? "score" : "responses") : "score";
  const max = host ? (complete ? 5 : event.invitees) : 5;
  const score = (() => {
    if (host) {
      return complete ? event.score : event.responses;
    } else {
      return event.metrics?.total_score ?? -1;
    }
  })();
  const label = complete
    ? host
      ? "Group Comfort Score"
      : "Individual Comfort Score"
    : host
      ? "Invitee Responses"
      : "Individual Comfort Score";

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

  if (event.host_id === User.user?.id) {
    return (
      <section className={classes.sectionWrapper}>
        <h2 hidden={screen !== "large"} className={classes.cardLabel}>
          Suggestions
        </h2>
        <SuggestionsCard />
      </section>
    );
  }

  const qc = !event.metrics.total_score;

  return (
    <section className={classes.sectionWrapper}>
      <h2 hidden={screen !== "large"} className={classes.cardLabel}>
        Comfort Metrics
      </h2>
      {qc ? <QuestionnaireCard eventId={event.id} /> : <ScoreDetailsCard />}
    </section>
  );
}

function QuestionnaireCard({ eventId }: { eventId: number }) {
  const screen = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });
  const [qOpen, setQOpen] = useState(false);

  async function submitQ(q: IQuestionnaire) {
    const res = await API.put(
      `events/${eventId}/invitees/${User.user?.id}/questionnaire`,
      q
    ).catch((err) => ({ status: "error", error: err }));
    if (!(res?.status === "error")) {
      setQOpen(false);
      setTimeout(() => publish("event_update"), 500);
    }
  }

  return (
    <Card color="primary" className={classes.questionnaireCard}>
      <small className={classes.questionnaireActionText}>ACTION</small>
      <h3 className={classes.questionnaireCallToAction}>
        Fill out your questionnaire to get your Comfort Score.
      </h3>
      <div className={classes.placeContentsEnd}>
        <Button
          color="white"
          transparent={true}
          end={<Icon size="medium" name="arrow_forward" />}
          size="large"
          onClick={() => setQOpen(true)}
        >
          Respond Now
        </Button>
        <Questionnaire
          open={qOpen}
          onClose={() => setQOpen(false)}
          onSubmit={(q) => submitQ(q)}
        />
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
        <div className={classes.separator} />
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
        <div className={classes.separator} />
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
        <div className={classes.separator} />
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

function SuggestionsCard() {
  const size = useScreen();
  const listType = size === "large" ? "contain" : "fill";

  return (
    <div>
      <List type={listType}>
        <ListItem
          start={<MiniScore type="score" value={4.2} max={5} />}
          end={
            <Button
              color="primary"
              transparent={true}
              end={<Icon size="small" name="chevron_right" />}
            >
              View Details
            </Button>
          }
        >
          Outdoors
        </ListItem>
        <ListItem
          start={<MiniScore type="score" value={3.3} max={5} />}
          end={
            <Button
              color="primary"
              transparent={true}
              end={<Icon size="small" name="chevron_right" />}
            >
              View Details
            </Button>
          }
        >
          Indoors
        </ListItem>
        <ListItem
          start={<MiniScore type="score" value={4.7} max={5} />}
          end={
            <Button
              color="primary"
              transparent={true}
              end={<Icon size="small" name="chevron_right" />}
            >
              View Details
            </Button>
          }
        >
          Remote
        </ListItem>
      </List>
    </div>
  );
}

export default EventDetailsPage;

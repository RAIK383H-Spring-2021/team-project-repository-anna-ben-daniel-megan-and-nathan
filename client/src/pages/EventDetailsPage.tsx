import { FC, Fragment, useEffect, useState } from "react";
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
import { Dialog } from "../components/Dialog";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { InfoBlock } from "../components/InfoBlock";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { MiniScore } from "../components/MiniScore";
import { Score } from "../components/Score";
import { Toolbar } from "../components/Toolbar";
import { FetchRequest, useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import { publish, useSubscription } from "../hooks/useSubscription";
import { Event, host_name, Metrics } from "../models/Event";
import { events } from "../resources/events";
import { AppTheme } from "../theme";
import { User } from "../User";
import { SetEventDetails, EventDetailsObject } from "./CreateEventPage";
import { AddParticipantsDialog } from "./partials/AddParticipantsDialog";
import { IQuestionnaire, Questionnaire } from "./partials/Questionnaire";
import { SuggestionDialog } from "./partials/SuggestionDialog";

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
    margin: ({ screen }) => screen !== "large" && `24px 0`,
  },
  detailsCard: {
    display: "grid",
    rowGap: 24,
    padding: ({ screen }) => screen !== "large" && `12px 28px 28px 28px`,
  },
  detailsCardDoubleColumn: {
    display: "grid",
    gridTemplateColumns: ({ screen }) =>
      screen === "large" ? "1fr 1fr" : "1fr",
    rowGap: 24,
  },
  cardLabel: {
    ...theme.typography.preTitle,
    paddingLeft: ({ screen }) => (screen !== "large" ? 28 : 4),
    paddingRight: ({ screen }) => (screen !== "large" ? 28 : 4),
    paddingBottom: 12,
  },
  questionnaireCard: {
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
    fontSize: ({ screen }) => (screen === "large" ? 28 : 20),
    lineHeight: ({ screen }) => (screen === "large" ? "34px" : "24px"),
    fontWeight: "normal",
    marginTop: ({ screen }) => (screen === "large" ? 18 : 6),
    marginBottom: ({ screen }) => (screen === "large" ? 72 : 42),
    flex: "1",
  },
  placeContentsEnd: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  comfortMetricsCard: {
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
    height: 36,
  },
  inviteesWrapper: {
    margin: ({ screen }) =>
      screen === "large" ? `48px 180px 0 180px` : `12px 0 24px 0`,
  },
  inviteesSpinnerWrapper: {
    display: "grid",
    placeItems: "center",
    margin: ({ screen }) => screen !== "large" && 24,
  },
  inviteeSectionTitleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingRight: ({ screen }) => (screen !== "large" ? 18 : 4),
  },
  emptySuggestions: {
    ...theme.typography.body,
    color: theme.colors.background.light?.color,
    whiteSpace: "break-spaces",
    margin: 28,
    fontSize: 18,
    lineHeight: "24px",
  },
  suggestionListItem: {
    paddingRight: 4,
  },
  loadingWrapper: {
    height: 100,
    display: "grid",
    placeItems: "center",
  },
  editToolbar: {
    position: "sticky",
    top: "-2px",
    borderRadius: "8px 8px 0 0 ",
  },
  editEventDetails: {
    maxWidth: "100% !important",
  },
}));

function suggestions(id: number): FetchRequest {
  return {
    method: "GET",
    path: `events/${id}/suggestions`,
  };
}

export interface ISuggestion {
  location_type: string;
  masks?: string;
  distancing?: string;
  room_size?: string;
  food?: string;
  score: string;
}

export interface ISuggestionData {
  indoor: ISuggestion;
  outdoor: ISuggestion;
  remote: ISuggestion;
}

interface ISuggestionResponse {
  suggestions: ISuggestionData;
}

const EventDetailsPage: FC = () => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const screen = useScreen();
  const { event_id } = useParams<{ event_id: string }>();
  const [response, isLoading, makeRequest] = useRequest<{ event: Event }>(
    events.get,
    event_id
  );

  const [suggestions_response] = useRequest<ISuggestionResponse>(
    suggestions,
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
            ? response.event?.title ?? "Loading..."
            : "Loading..."
        }
      />
      {isLoading ? (
        <div className={classes.loadingWrapper}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      ) : response ? (
        screen === "large" ? (
          <EventDetailsLarge
            event={response.event}
            loading={isLoading}
            suggestions={suggestions_response?.suggestions}
          />
        ) : (
          <EventDetailsSmall
            event={response.event}
            loading={isLoading}
            suggestions={suggestions_response?.suggestions}
          />
        )
      ) : (
        <div className={classes.loadingWrapper}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      )}
    </Fragment>
  );
};

function EventDetailsLarge({
  event,
  loading,
  suggestions,
}: {
  loading: boolean;
  event: Event;
  suggestions?: ISuggestionData;
}) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  const host = (event && event.host_id === User.user?.id) ?? 0;

  function goBack() {
    if (window.history.state?.state?.referrer) {
      if (window.history.state.state.referrer === "dashboard") {
        history.goBack();
        return;
      }
    }

    history.push("/dash");
  }

  const [isEditing, setEditing] = useState(false);

  const submitEventEdits = async (newDetails: EventDetailsObject) => {
    const social_distancing_masks =
      newDetails.masks === "none" ? null : newDetails.distancing;
    const social_distancing_no_masks =
      newDetails.masks === "none" ? newDetails.distancing : null;

    const res = await API.put(`events/${event.id}`, {
      title: newDetails.title,
      host_id: User.user?.id,
      description: newDetails.description,
      date_time: new Date(
        `${newDetails.date}T${newDetails.time}`
      ).toISOString(),
      food_prepackaged: newDetails.food === "pp",
      food_buffet: newDetails.food === "ss",
      location: newDetails.location,
      indoor: newDetails.location_type === "indoor",
      outdoor: newDetails.location_type === "outdoor",
      remote: newDetails.location_type === "remote",
      social_distancing_masks,
      social_distancing_no_masks,
    });

    if (res.error) {
      alert("that didn't work");
    } else {
      setEditing(false);
      publish("event_update");
    }
  };

  return (
    <Content
      toolbar={
        <Toolbar
          background="filled"
          start={<IconButton icon="arrow_back" onClick={goBack} />}
          end={
            host && <IconButton icon="edit" onClick={() => setEditing(true)} />
          }
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
            <ComfortMetricSection event={event} suggestions={suggestions} />
          </div>
          {host && <InviteeList event_id={event.id} />}
        </div>
      )}
      {loading && (
        <div className={classes.loading}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      )}
      <EditDetailsDialog
        isEditing={isEditing}
        event={event}
        onClose={() => setEditing(false)}
        onSubmit={submitEventEdits}
      />
      <Background className={classes.desktopBackground} />
    </Content>
  );
}

function EventDetailsSmall({
  event,
  loading,
  suggestions,
}: {
  loading: boolean;
  event: Event;
  suggestions?: ISuggestionData;
}) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  const host = (event && event.host_id === User.user?.id) ?? 0;

  function goBack() {
    if (window.history.state?.state?.referrer) {
      if (window.history.state.state.referrer === "dashboard") {
        history.goBack();
        return;
      }
    }

    history.push("/dash");
  }

  const [isEditing, setEditing] = useState(false);

  const submitEventEdits = async (newDetails: EventDetailsObject) => {
    const social_distancing_masks =
      newDetails.masks === "none" ? null : newDetails.distancing;
    const social_distancing_no_masks =
      newDetails.masks === "none" ? newDetails.distancing : null;

    const res = await API.put(`events/${event.id}`, {
      title: newDetails.title,
      host_id: User.user?.id,
      description: newDetails.description,
      date_time: new Date(
        `${newDetails.date}T${newDetails.time}`
      ).toISOString(),
      food_prepackaged: newDetails.food === "pp",
      food_buffet: newDetails.food === "ss",
      location: newDetails.location,
      indoor: newDetails.location_type === "indoor",
      outdoor: newDetails.location_type === "outdoor",
      remote: newDetails.location_type === "remote",
      social_distancing_masks,
      social_distancing_no_masks,
    });

    if (res.error) {
      alert("that didn't work");
    } else {
      setEditing(false);
      publish("event_update");
    }
  };

  return (
    <Content
      toolbar={
        <Toolbar
          background="filled"
          start={<IconButton icon="arrow_back" onClick={goBack} />}
          end={
            host && <IconButton icon="edit" onClick={() => setEditing(true)} />
          }
          size="normal"
          title={event?.title ?? "Loading..."}
        />
      }
    >
      {event && (
        <div className={classes.mobileWrapper}>
          <Meter event={event} />
          <ComfortMetricSection event={event} suggestions={suggestions} />
          <SummarySection event={event} />
          {host && <InviteeList event_id={event.id} />}
        </div>
      )}
      {loading && (
        <div className={classes.loading}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      )}
      <EditDetailsDialog
        isEditing={isEditing}
        event={event}
        onClose={() => setEditing(false)}
        onSubmit={submitEventEdits}
      />
    </Content>
  );
}

function EditDetailsDialog({
  isEditing,
  event,
  onClose,
  onSubmit,
}: {
  isEditing: boolean;
  event: Event;
  onClose: () => void;
  onSubmit: (eventDetails: EventDetailsObject) => void;
}) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const convertEventToEventDetailsObject = (event: Event) => {
    const result: EventDetailsObject = {
      title: event.title,
      description: event.description,
      date: new Date(event.date_time).toISOString().split("T")[0],
      time: new Date(event.date_time).toLocaleTimeString("en-US", {
        hour12: false,
      }),
      location: event.location,
      location_type: event.indoor
        ? "indoor"
        : event?.outdoor
        ? "outdoor"
        : "remote",
      masks: event.social_distancing_masks ? "1me" : "none",
      distancing:
        event.social_distancing_masks?.toString() ??
        event.social_distancing_no_masks?.toString() ??
        "0",
      food: event.food_buffet ? "ss" : event?.food_prepackaged ? "pp" : "none",
    };
    return result;
  };

  const [validForm, setValidForm] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetailsObject>(
    convertEventToEventDetailsObject(event)
  );

  useEffect(() => {
    setValidForm(
      !(
        eventDetails.title?.length === 0 ||
        eventDetails.date?.length === 0 ||
        eventDetails.time?.length === 0 ||
        eventDetails.location_type?.length === 0 ||
        eventDetails.location?.length === 0
      )
    );
  }, [eventDetails]);

  useEffect(() => {
    setEventDetails(convertEventToEventDetailsObject(event));
  }, [event]);

  return (
    <Dialog open={isEditing} onClose={onClose}>
      <Toolbar
        className={classes.editToolbar}
        background="filled"
        title="Edit Event"
        start={<IconButton icon="close" onClick={onClose} />}
        end={
          <Button
            onClick={() => onSubmit(eventDetails)}
            color="accent"
            disabled={!validForm}
          >
            Submit
          </Button>
        }
      />
      <SetEventDetails
        className={classes.editEventDetails}
        eventDetails={eventDetails}
        setEventDetails={setEventDetails}
      />
    </Dialog>
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
  const screen = useScreen();
  const date = new Date(event.date_time);

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });

  return (
    <section className={classes.sectionWrapper}>
      <h2 className={classes.cardLabel}>Details</h2>
      <Card
        color="background"
        borderless={screen !== "large"}
        className={classes.detailsCard}
      >
        <InfoBlock icon="text_fields" label="event title" body={event.title} />
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
        <div className={classes.detailsCardDoubleColumn}>
          <InfoBlock
            icon="nature_people"
            label="location type"
            body={
              event.indoor ? "Indoor" : event.outdoor ? "Outdoor" : "Remote"
            }
          />
          <InfoBlock
            icon="restaurant_menu"
            label="food"
            body={
              event.food_buffet
                ? "Yes, Self-serve"
                : event.food_prepackaged
                ? "Yes, Pre-packaged"
                : "No food"
            }
          />
        </div>
        <div className={classes.detailsCardDoubleColumn}>
          <InfoBlock
            icon="masks"
            label="masks"
            body={event.social_distancing_masks ? "Masks required" : "No masks"}
          />
          <InfoBlock
            icon="social_distance"
            label="social distancing"
            body={`${
              event.social_distancing_masks
                ? event.social_distancing_masks
                : event.social_distancing_no_masks
            } feet`}
          />
        </div>
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

function ComfortMetricSection({
  event,
  suggestions,
}: {
  event: Event;
  suggestions?: ISuggestionData;
}) {
  const screen = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });

  if (event.host_id === User.user?.id) {
    return (
      <section className={classes.sectionWrapper}>
        <h2 className={classes.cardLabel}>Suggestions</h2>
        <SuggestionsCard event={event} suggestions={suggestions} />
      </section>
    );
  }

  const qc = !event.metrics.total_score;

  return (
    <section className={classes.sectionWrapper}>
      <h2 hidden={screen !== "large"} className={classes.cardLabel}>
        Comfort Metrics
      </h2>
      {qc ? (
        <QuestionnaireCard eventId={event.id} />
      ) : (
        <ScoreDetailsCard event={event} />
      )}
    </section>
  );
}

interface QuestionnaireResponse {
  questionnaire: IQuestionnaire;
  metrics: Metrics;
}

function QuestionnaireCard({ eventId }: { eventId: number }) {
  const screen = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });
  const [qOpen, setQOpen] = useState(false);

  async function submitQ(q: IQuestionnaire) {
    const res = await API.put<QuestionnaireResponse>(
      `events/${eventId}/invitees/${User.user?.id}/questionnaire`,
      q
    );
    if (!res.error) {
      setQOpen(false);
      setTimeout(() => publish("event_update"), 500);
    } else {
      alert("There was an error");
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

function ScoreDetailsCard({ event }: { event: Event }) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const screen = useScreen();

  function locationText() {
    if (event.indoor) {
      return "Indoor Venue";
    } else if (event.outdoor) {
      return "Outdoor Venue";
    } else {
      return "Indoor";
    }
  }

  function msdPrimaryText() {
    if (event.social_distancing_masks) {
      return `Masks required, ${event.social_distancing_masks}-foot social distancing required.`;
    } else {
      return `Masks required, ${event.social_distancing_no_masks}-foot social distancing required.`;
    }
  }

  function msdSecondaryText() {
    if (event.indoor) {
      if (User.questionnaire["q6"] > 2) {
        if (event.social_distancing_masks) {
          return `You prefer others to wear masks and distancing of at least ${User.questionnaire["q4"]} feet.`;
        } else {
          return `You prefer others to wear masks and distancing of at least ${User.questionnaire["q5"]} feet.`;
        }
      } else {
        if (event.social_distancing_masks) {
          return `You prefer distancing of at least ${User.questionnaire["q4"]} feet.`;
        } else {
          return `You prefer distancing of at least ${User.questionnaire["q5"]} feet.`;
        }
      }
    } else {
      if (User.questionnaire["q6"] > 2) {
        if (event.social_distancing_masks) {
          return `You prefer others to wear masks and distancing of at least ${User.questionnaire["q10"]} feet.`;
        } else {
          return `You prefer others to wear masks and distancing of at least ${User.questionnaire["q11"]} feet.`;
        }
      } else {
        if (event.social_distancing_masks) {
          return `You prefer distancing of at least ${User.questionnaire["q10"]} feet.`;
        } else {
          return `You prefer distancing of at least ${User.questionnaire["q11"]} feet.`;
        }
      }
    }
  }

  function foodPrimary() {
    if (event.food_buffet) {
      return "Food will be served buffet-style.";
    } else {
      return "Food will be served pre-packaged.";
    }
  }

  function foodSecondary() {
    if (event.indoor) {
      if (User.questionnaire["q7"] <= 2 && User.questionnaire["q8"] <= 2) {
        return "You prefer food to not be served.";
      }
      if (event.food_buffet) {
        if (
          User.questionnaire["q7"] > User.questionnaire["q8"] &&
          User.questionnaire["q7"] > 2
        ) {
          return "You prefer food to be pre-packaged";
        }
      } else {
        if (
          User.questionnaire["q8"] > User.questionnaire["q7"] &&
          User.questionnaire["q8"] > 2
        ) {
          return "You prefer food to be buffet-style";
        }
      }
    } else {
      if (User.questionnaire["q13"] <= 2 && User.questionnaire["q14"] <= 2) {
        return "You prefer food to not be served.";
      }
      if (event.food_buffet) {
        if (User.questionnaire["q13"] > User.questionnaire["q14"]) {
          return "You prefer food to be pre-packaged";
        }
      } else {
        if (User.questionnaire["q14"] > User.questionnaire["q13"]) {
          return "You prefer food to be buffet-style";
        }
      }
    }
  }

  function pluralizedArticle(n: number) {
    return n === 1 ? "is" : "are";
  }

  function pluralizedInvitee(n: number) {
    return n === 1 ? "invitee" : "invitees";
  }

  function sizePreferenceText() {
    if (event.indoor) {
      const n = User.questionnaire["q9"];
      if (n === -1) return "You are comfortable with any number of attendees.";
      return `You prefer no more than ${n} ${pluralizedInvitee(n)}.`;
    } else {
      const n = User.questionnaire["q15"];
      if (n === -1) return "You are comfortable with any number of attendees.";
      return `You prefer no more than ${n} ${pluralizedInvitee(n)}.`;
    }
  }

  if (screen === "large") {
    return (
      <Card
        color="background"
        borderless={screen !== "large"}
        className={classes.comfortMetricsCard}
      >
        <div className={classes.desktopScoreItem}>
          <div className={classes.desktopScoreIcon}>
            <MiniScore
              type="score"
              value={event.metrics.subscores.location_score}
              max={5}
              icon="nature_people"
            />
          </div>
          <div className={classes.desktopScoreAside}>
            <div>{locationText()}</div>
          </div>
        </div>
        <div className={classes.separator} />
        {!event.remote && (
          <>
            <div className={classes.desktopScoreItem}>
              <div className={classes.desktopScoreIcon}>
                <MiniScore
                  type="score"
                  value={event.metrics.subscores.masks_social_dist_score}
                  max={5}
                  icon="masks"
                />
              </div>
              <div className={classes.desktopScoreAside}>
                <div>{msdPrimaryText()}</div>
                <div className={classes.desktopScoreExplanation}>
                  {msdSecondaryText()}
                </div>
              </div>
            </div>
            <div className={classes.separator} />
          </>
        )}
        {event.metrics.subscores.food_score && (
          <>
            <div className={classes.desktopScoreItem}>
              <div className={classes.desktopScoreIcon}>
                <MiniScore
                  type="score"
                  value={event.metrics.subscores.food_score}
                  max={5}
                  icon="restaurant_menu"
                />
              </div>
              <div className={classes.desktopScoreAside}>
                <div>{foodPrimary()}</div>
                <div className={classes.desktopScoreExplanation}>
                  {foodSecondary()}
                </div>
              </div>
            </div>
            <div className={classes.separator} />
          </>
        )}
        <div className={classes.desktopScoreItem}>
          <div className={classes.desktopScoreIcon}>
            <MiniScore
              type="score"
              value={event.metrics.subscores.group_size_score}
              max={5}
              icon="people"
            />
          </div>
          <div className={classes.desktopScoreAside}>
            <div>
              There {pluralizedArticle(event.invitees)} {event.invitees}{" "}
              {pluralizedInvitee(event.invitees)}.
            </div>
            <div className={classes.desktopScoreExplanation}>
              {sizePreferenceText()}
            </div>
          </div>
        </div>
      </Card>
    );
  } else {
    return <Icon name="person" />;
  }
}

function SuggestionsCard({
  event,
  suggestions,
}: {
  event: Event;
  suggestions?: ISuggestionData;
}) {
  const size = useScreen();
  const listType = size === "large" ? "contain" : "fill";
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const [dialogData, setDialogData] = useState<ISuggestion | undefined>();

  const updateEventData = async (revisedData: ISuggestion) => {
    const res = await API.put(`events/${event.id}`, {
      title: event.title,
      host_id: User.user?.id,
      description: event.description,
      date_time: new Date(`${event.date_time}`).toISOString(),
      food_prepackaged: revisedData.food === "pp",
      food_buffet: revisedData.food === "ss",
      location: event.location,
      indoor: revisedData.location_type === "indoor",
      outdoor: revisedData.location_type === "outdoor",
      remote: revisedData.location_type === "remote",
      social_distancing_masks:
        revisedData.masks === "none" ? null : revisedData.distancing,
      social_distancing_no_masks:
        revisedData.masks === "none" ? revisedData.distancing : null,
    });

    if (res.error) {
      alert("that didn't work");
    } else {
      setDialogData(undefined);
      publish("event_update");
    }
  };

  return (
    <div>
      <List type={listType}>
        {suggestions &&
        Object.entries(suggestions).filter(
          ([s_key, s_data]) => s_data.score !== null
        ).length > 0 ? (
          Object.entries(suggestions).map(([location_type, suggestionData]) => {
            const cleanedData: ISuggestion = {
              location_type,
              masks: suggestionData.masks
                ? "1me"
                : location_type === "indoor"
                ? "none"
                : undefined,
              food:
                suggestionData.food_type ||
                (location_type === "remote" ? undefined : "none"),
              distancing: suggestionData.distance?.toString() || undefined,
              room_size: suggestionData.room_size?.toString() || undefined,
              score: suggestionData.score,
            };
            return (
              <ListItem
                className={classes.suggestionListItem}
                start={
                  <MiniScore
                    type="score"
                    value={parseFloat(suggestionData.score)}
                    max={5}
                  />
                }
                end={
                  <Button
                    color="primary"
                    transparent={true}
                    end={<Icon size="small" name="chevron_right" />}
                    onClick={() => setDialogData(cleanedData)}
                  >
                    View Details
                  </Button>
                }
              >
                {location_type.charAt(0).toUpperCase() +
                  location_type.substring(1)}
              </ListItem>
            );
          })
        ) : (
          <p className={classes.emptySuggestions}>
            Check back for event planning suggestions after more people have
            responded to your event!
          </p>
        )}
        <SuggestionDialog
          open={dialogData ? true : false}
          suggestion={dialogData}
          onSubmit={(revisedData) => updateEventData(revisedData)}
          onClose={() => setDialogData(undefined)}
        />
      </List>
    </div>
  );
}

function getInvitees(id: number): FetchRequest {
  return {
    method: "GET",
    path: `events/${id}/invitees`,
  };
}

const InviteeList: FC<{ event_id: number }> = ({ event_id }) => {
  const [response, isLoading] = useRequest<User[]>(getInvitees, event_id);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const screen = useScreen();

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, screen });

  async function submitInvitees(invitees: User[]) {
    const response = await API.post<{ id: number }>(
      `events/${event_id}/invitees`,
      { user_ids: invitees.map((i) => i.id) }
    );
    if (response.error) {
      alert("Error!");
    } else {
      setShowAddDialog(false);
      setTimeout(() => publish("event_update"), 750);
    }
  }

  if (isLoading) {
    return (
      <section className={classes.inviteesWrapper}>
        <h2 className={classes.cardLabel}>Participants</h2>
        <div className={classes.inviteesSpinnerWrapper}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      </section>
    );
  } else {
    return (
      <section className={classes.inviteesWrapper}>
        <div className={classes.inviteeSectionTitleWrapper}>
          <h2 className={classes.cardLabel}>Participants</h2>
          <IconButton icon="add" onClick={() => setShowAddDialog(true)} />
        </div>
        <List type={screen === "large" ? "contain" : "fill"}>
          {response?.map((invitee) => (
            <ListItem key={invitee.id} subtitle={invitee.email}>
              {invitee.first_name} {invitee.last_name}
            </ListItem>
          ))}
        </List>
        <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
          <AddParticipantsDialog
            onClose={() => setShowAddDialog(false)}
            onSubmit={(val) => submitInvitees(val)}
            current={response ?? []}
          />
        </Dialog>
      </section>
    );
  }
};

export default EventDetailsPage;

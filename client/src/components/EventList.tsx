import { createUseStyles } from "react-jss";
import MDSpinner from "react-md-spinner";
import { useHistory } from "react-router";
import { useTheme } from "theming";
import { Event } from "../resources/dashboard";
import { AppTheme } from "../theme";
import { InfoIconStack } from "./InfoStack";
import { List } from "./List";
import { ListItem } from "./ListItem";
import { MiniScore } from "./MiniScore";

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
  wrapper: {
    animationName: "$slideIn",
    animationDuration: "375ms",
    animationTimingFunction: theme.transitions.easing.default,
  },
  sectionHeader: {
    ...theme.typography.preTitle,
    marginTop: 32,
    marginLeft: 28,
    marginBottom: 12,
  },
  loadingWrapper: {
    height: 100,
    display: "grid",
    placeItems: "center",
  },
}));

export interface EventListComponentProps {
  events: Event[];
  title: string;
  loading: boolean;
  style: "fill" | "contain";
  info: string[];
}

export function EventList(props: EventListComponentProps) {
  const { events, title, loading, style, info } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  return (
    <div>
      <h2 className={classes.sectionHeader}>{title}</h2>
      {loading ? (
        <div className={classes.loadingWrapper}>
          <MDSpinner singleColor={theme.colors.primary.base.backgroundColor} />
        </div>
      ) : (
        <List type={style} className={classes.wrapper}>
          {events.map((event, i) => {
            if (event.status === "complete") {
              return (
                <ListItem
                  key={i}
                  button={true}
                  start={<MiniScore value={event.score} type="score" />}
                  end={<InfoIconStack info={getInfo(event, info)} />}
                  subtitle={truncateDescription(event.description)}
                  onClick={() => history.push(`/events/${event.id}`)}
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
                end={<InfoIconStack info={getInfo(event, info)} />}
                onClick={() => history.push(`/events/${event.id}`)}
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
    </div>
  );
}

function getInfo(event: Event, selections: string[]) {
  const m = new Map([
    ["creator", { text: event.creator, icon: "person" }],
    [
      "date",
      { text: new Date(event.date_time).toLocaleDateString(), icon: "event" },
    ],
    [
      "invitees",
      { text: event.invitees.toString() + " invitees", icon: "people" },
    ],
  ]);

  return selections.map(
    (selection) => m.get(selection) ?? { text: "", icon: "" }
  );
}

function truncateDescription(description: string) {
  const trimmed = description.replace(/[\n\r]+/g, " ").trim();
  if (trimmed.length > 70) {
    return trimmed.slice(0, 75) + "...";
  } else return trimmed;
}

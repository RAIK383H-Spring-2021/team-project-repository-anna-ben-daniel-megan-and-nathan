import { createUseStyles } from "react-jss";
import { useHistory } from "react-router";
import { useTheme } from "theming";
import { Event } from "../resources/dashboard";
import { AppTheme } from "../theme";
import { InfoIconStack } from "./InfoStack";
import { List } from "./List";
import { ListItem } from "./ListItem";
import { MiniScore } from "./MiniScore";

const useStyles = createUseStyles((theme: AppTheme) => ({
  sectionHeader: {
    ...theme.typography.preTitle,
    marginTop: 32,
    marginLeft: 28,
    marginBottom: 12,
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

  if (events.length < 1) {
    return null;
  }

  return (
    <div>
      <h2 className={classes.sectionHeader}>{title}</h2>
      {loading ? (
        "Loading..."
      ) : (
        <List type={style}>
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

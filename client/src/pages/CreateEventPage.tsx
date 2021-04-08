import { FC, useState } from "react";
import { useHistory } from "react-router";
import { createUseStyles, useTheme } from "react-jss";
import { IconButton } from "../components/IconButton";
import { Toolbar } from "../components/Toolbar";
import { Background } from "../components/Background";
import { AppTheme } from "../theme";
import { Content } from "../components/Content";
import { useScreen } from "../hooks/useScreen";
import { Stepper } from "../components/Stepper";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { FAB } from "../components/FAB";
import { Icon } from "../components/Icon";
import { FetchRequest, MutativeRequest, useRequest } from "../hooks/useRequest";
import { User } from "../User";
import MDSpinner from "react-md-spinner";
import { API } from "../api";
import { Helmet } from "react-helmet";
import { Slider } from "../components/Slider";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: ({ size }) => {
    if (size === "large") {
      return {
        position: "relative",
        top: "20vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 2,
      };
    }
  },
  eventDetailsWrapper: {
    width: 510,
    display: "flex",
    flexDirection: "column",
    marginBottom: "calc(20vh - 24px)",
    "& > *": {
      marginBottom: 24,
    },
  },
  eventDetailsDivider: {
    height: 1,
    alignSelf: "stretch",
    backgroundColor: theme.colors.divider.base.backgroundColor,
  },
  horizontalInputs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: 24,
  },
  stepper: ({ size }) => {
    if (size === "large") {
      return {
        position: "fixed",
        top: "20vh",
        left: 180,
        zIndex: 5,
      };
    } else {
      return {
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 5,
      };
    }
  },
  background: ({ size }) =>
    size === "large"
      ? {
        height: "90vh",
        width: "90vh",
        position: "fixed",
        top: "-20vh",
        right: "-20vh",
        zIndex: 1,
      }
      : {
        display: "none",
      },
  addParticipantsWrapper: ({ size }) => {
    if (size === "large") {
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: 60,
        width: "100%",
        marginRight: "20vw",
        marginLeft: "calc(20vw + ((60vw - (60px * 3)) / 4))",
      };
    }
  },
  searchPanel: ({ size }) =>
    size === "large"
      ? {
        height: "60vh",
        display: "flex",
        flexDirection: "column",
      }
      : {},
  searchResultList: {
    flexShrink: 1,
    overflowY: "auto",
  },
  inviteesPanel: ({ size }) =>
    size === "large"
      ? {
        height: "60vh",
        display: "flex",
        flexDirection: "column",
      }
      : {},
  sectionHeader: {
    ...theme.typography.preTitle,
    marginLeft: 28,
    marginBottom: 12,
  },
  inviteesList: ({ size }) =>
    size === "large"
      ? {
        flexGrow: 1,
        backgroundColor: theme.colors.background.base.backgroundColor,
        overflowY: "auto",
      }
      : {},
  sendInvitationsWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },
  sendConfirmation: {
    ...theme.typography.heading,
    color: theme.colors.background.base.color,
    textAlign: "center",
    "&>span": {
      color: theme.colors.primary.base.backgroundColor,
    },
  },
  giantFAB: {
    padding: "56px 52px 56px 60px",
    width: 184,
    height: 184,
    borderRadius: 92,
    marginTop: 36,
    "&>*": {
      fontSize: 72,
    },
  },
  emptySearchStateContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    textAlign: "center",
    "& > h2": {
      ...theme.typography.subheading,
      marginTop: 24,
    },
  },
  emptySearchIconWrapper: {
    width: 72,
    height: 72,
    boxSizing: "content-box",
    padding: 36,
    backgroundColor: "rgba(103, 152, 248, 0.25)",
    display: "inline-block",
    borderRadius: "50%",
    "& > span": {
      color: theme.colors.primary.base.backgroundColor,
      opacity: 1.0,
    },
  },
  searchResultSpinner: {
    display: "grid",
    padding: 18,
    placeContent: "center",
  },
}));

export interface CreateEventPageComponentProps { }

interface EventDetailsObject {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  location_type?: string;
  masks?: string;
  distancing?: string;
  food?: string;
}

const CreateEventPage: FC<CreateEventPageComponentProps> = (props) => {
  const size = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size });
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [eventDetails, setEventDetails] = useState<EventDetailsObject>({});
  const [invitees, setInvitees] = useState<UserObject[]>([]);

  const [stepperDisabled, setStepperDisabled] = useState<boolean[]>([
    false,
    true,
    true,
  ]);

  const handleEventDetailsChange = (eventDetails: EventDetailsObject) => {
    setEventDetails(eventDetails);
    setStepperDisabled([
      false,
      eventDetails.title === undefined || eventDetails.title.length === 0,
      invitees.length === 0,
    ]);
  };

  const handleInviteesChange = (invitees: UserObject[]) => {
    setInvitees(invitees);
    setStepperDisabled([
      false,
      eventDetails.title === undefined || eventDetails.title.length === 0,
      invitees.length === 0,
    ]);
  };

  return (
    <Content
      toolbar={
        <Toolbar
          title="Create Event"
          size={size === "large" ? "large" : "normal"}
          start={
            <IconButton icon="arrow_back" onClick={() => history.goBack()} />
          }
        />
      }
    >
      <Helmet title="Create Event" />
      <Stepper
        className={classes.stepper}
        disabled={stepperDisabled}
        onChange={(step) => setActiveStep(step)}
      />
      <div className={classes.wrapper}>
        {activeStep === 0 ? (
          <SetEventDetails
            eventDetails={eventDetails}
            setEventDetails={(eventDetails) =>
              handleEventDetailsChange(eventDetails)
            }
          />
        ) : activeStep === 1 ? (
          <AddParticipants
            invitees={invitees}
            setInvitees={(invitees) => handleInviteesChange(invitees)}
          />
        ) : (
          <SendInvitations eventDetails={eventDetails} invitees={invitees} />
        )}
      </div>
      <Background className={classes.background} />
    </Content>
  );
};

interface SetEventDetailsProps {
  eventDetails: EventDetailsObject;
  setEventDetails: (eventDetails: EventDetailsObject) => void;
}

function SetEventDetails(props: SetEventDetailsProps) {
  const size = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size });

  const updateEventDetails = (
    key:
      | "title"
      | "description"
      | "date"
      | "time"
      | "location"
      | "location_type"
      | "masks"
      | "distancing"
      | "food",
    value: string
  ) => {
    const newEventDetails = props.eventDetails;
    newEventDetails[key] = value;
    props.setEventDetails(newEventDetails);
  };

  return (
    <div className={classes.eventDetailsWrapper}>
      <Input
        type="text"
        label="Title"
        value={props.eventDetails.title}
        onChange={(value) => updateEventDetails("title", value)}
      />
      <Input
        type="text"
        label="Description"
        value={props.eventDetails.description}
        onChange={(value) => updateEventDetails("description", value)}
      />
      <div className={classes.eventDetailsDivider} />
      <div className={classes.horizontalInputs}>
        <Input
          type="date"
          label="Date"
          value={props.eventDetails.date}
          onChange={(value) => updateEventDetails("date", value)}
        />
        <Input
          type="time"
          label="Time"
          value={props.eventDetails.time}
          onChange={(value) => updateEventDetails("time", value)}
        />
      </div>
      <div className={classes.eventDetailsDivider} />
      <Input
        type="text"
        label="Address"
        value={props.eventDetails.location}
        onChange={(value) => updateEventDetails("location", value)}
      />
      <Select
        label="Location Type"
        onChange={(value) => updateEventDetails("location_type", value)}
      >
        <option value="outdoor">Outdoor</option>
        <option value="indoor">Indoor</option>
        <option value="remote">Remote</option>
      </Select>
      <div className={classes.eventDetailsDivider} />
      <Select
        label="Mask Wearing"
        caption="CDC guidance recommends that double masking occur to prevent the spread of COVID-19."
        onChange={(value) => updateEventDetails("masks", value)}
      >
        <option value="1me">Masks required</option>
        <option value="none">No masks</option>
      </Select>
      <Slider
        label="Social Distancing"
        value={props.eventDetails.distancing}
        onChange={(value) => updateEventDetails("distancing", value)}
        min={0}
        max={12}
        units="feet"
      />
      <div className={classes.eventDetailsDivider} />
      <Select
        label="Is food being served?"
        onChange={(value) => updateEventDetails("food", value)}
      >
        <option value="ss">Yes, Self-serve</option>
        <option value="pp">Yes, Pre-packaged</option>
        <option value="none">No food allowed</option>
      </Select>
    </div>
  );
}

interface UserObject {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
}

interface AddParticipantsProps {
  invitees: UserObject[];
  setInvitees: (invitees: UserObject[]) => void;
}

interface SearchUsersResponse {
  users: User[];
}

const searchUsers = (query: string) =>
({
  method: "GET",
  path: "users",
  query: { q: query },
} as FetchRequest);

function AddParticipants(props: AddParticipantsProps) {
  const size = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size });
  const [query, setQuery] = useState("");
  const [results, isLoading, makeRequest] = useRequest<SearchUsersResponse>(
    searchUsers
  );

  const debounce = (email: string) => {
    setQuery(email);
    makeRequest(email);
  };

  const addInvitee = (add: UserObject) => {
    const newInviteeList = props.invitees;
    newInviteeList.push(add);
    console.log(newInviteeList);
    props.setInvitees(newInviteeList);
    setQuery("");
  };

  const removeInvitee = (remove: UserObject) => {
    let newInviteeList = props.invitees;
    newInviteeList = newInviteeList.filter(
      (invitee) => invitee.email !== remove.email
    );
    props.setInvitees(newInviteeList);
  };

  return (
    <div className={classes.addParticipantsWrapper}>
      <div className={classes.searchPanel}>
        <Input
          type="search"
          placeholder="Invite with email address"
          value={query}
          onChange={(value) => debounce(value)}
        />
        {query.length > 0 ? (
          <>
            <h2 className={classes.sectionHeader}>Results</h2>
            <List type="contain" className={classes.searchResultList}>
              {results && !isLoading ? (
                results.users
                  .filter(
                    (user) =>
                      !props.invitees.find((i) => i.email === user.email)
                  )
                  .map((user) => {
                    if (user.first_name.length === 0) {
                      return (
                        <ListItem
                          button={true}
                          onClick={() => {
                            addInvitee(user);
                          }}
                          end={<Icon name="add" />}
                          key={user.email}
                        >
                          {user.email}
                        </ListItem>
                      );
                    } else {
                      return (
                        <ListItem
                          button={true}
                          subtitle={user.email}
                          onClick={() => {
                            addInvitee(user);
                          }}
                          end={<Icon name="add" />}
                          key={user.email}
                        >
                          {user.first_name} {user.last_name}
                        </ListItem>
                      );
                    }
                  })
              ) : (
                <div className={classes.searchResultSpinner}>
                  <MDSpinner
                    singleColor={theme.colors.primary.base.backgroundColor}
                  />
                </div>
              )}
            </List>
          </>
        ) : (
          <div className={classes.emptySearchStateContainer}>
            <div className={classes.emptySearchIconWrapper}>
              <Icon name="search" size="giant" />
            </div>
            <h2>
              Start typing an email address to invite people to your event
            </h2>
          </div>
        )}
      </div>
      <div className={classes.inviteesPanel}>
        <h2 className={classes.sectionHeader}>
          Invitees ({props.invitees.length})
        </h2>
        <List type="contain" className={classes.inviteesList}>
          {props.invitees.map((invitee) => {
            if (invitee.first_name.length === 0) {
              return (
                <ListItem
                  button={true}
                  onClick={() => {
                    removeInvitee(invitee);
                  }}
                  end={<Icon name="delete" />}
                  key={invitee.email}
                >
                  {invitee.email}
                </ListItem>
              );
            } else {
              return (
                <ListItem
                  button={true}
                  onClick={() => {
                    removeInvitee(invitee);
                  }}
                  subtitle={invitee.email}
                  end={<Icon name="delete" />}
                  key={invitee.email}
                >
                  {invitee.first_name} {invitee.last_name}
                </ListItem>
              );
            }
          })}
        </List>
      </div>
    </div>
  );
}

interface SendInvitationsProps {
  eventDetails: EventDetailsObject;
  invitees: UserObject[];
}

interface CreateEventResponse {
  id: number;
}

const createEvent = (eventObject: EventDetailsObject) =>
({
  method: "POST",
  path: "events",
  body: {
    title: eventObject.title,
    host_id: User.getUser()?.id,
    description: eventObject.description,
    date_time: new Date(
      `${eventObject.date}T${eventObject.time}`
    ).toISOString(),
    food_prepackaged: eventObject.food === "pp",
    food_buffet: eventObject.food === "ss",
    location: eventObject.location,
    indoor: eventObject.location_type === "indoor",
    outdoor: eventObject.location_type === "outdoor",
    remote: eventObject.location_type === "remote",
    score: -1,
  },
} as MutativeRequest);

let invitesPushed = false;

function SendInvitations(props: SendInvitationsProps) {
  const size = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size });
  const history = useHistory();

  const [ceResponse, ceLoading, ceMakeRequest] = useRequest<
    CreateEventResponse
  >(createEvent);

  if (ceResponse && !ceLoading) {
    if (!invitesPushed) {
      invitesPushed = true;
      inviteUsers();
    }
  }

  async function inviteUsers() {
    const url = API.makeUrl(`events/${ceResponse?.id}/invitees`);
    for (const user of props.invitees) {
      await fetch(url, {
        body: JSON.stringify({
          user_id: user.id,
          questionnaire_complete: false,
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    }
    history.push(`/events/${ceResponse?.id}`);
  }

  return (
    <div className={classes.sendInvitationsWrapper}>
      <h2 className={classes.sendConfirmation}>
        Send invitations for
        <br />
        <span>{props.eventDetails.title}</span>
        <br />
        to {props.invitees.length}{" "}
        {props.invitees.length === 1 ? "person" : "people"}
      </h2>
      <FAB
        icon="send"
        loading={ceLoading}
        onClick={() => ceMakeRequest(props.eventDetails)}
        className={classes.giantFAB}
        size="giant"
      />
    </div>
  );
}

export default CreateEventPage;

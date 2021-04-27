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
import { FetchRequest, useRequest } from "../hooks/useRequest";
import { User } from "../User";
import MDSpinner from "react-md-spinner";
import { API } from "../api";
import { Helmet } from "react-helmet";
import { Slider } from "../components/Slider";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: ({ size }) => {
    const base = {
      position: "relative",
      width: "100vw",
      overflowY: "auto",
      overflowX: "hidden",
      zIndex: 2,
    };
    if (size === "large") {
      return {
        ...base,
        top: "20vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      };
    } else {
      return {
        ...base,
        height: "calc(100vh-75px-88px)",
        top: 81,
      };
    }
  },
  toolbar: {
    position: "sticky",
    top: 0,
    "&.scrolled": {
      boxShadow: "0 4 8 rgba(0, 0, 0, 0.1)",
    },
  },
  searchBarWrapper: {
    margin: [12, 24, 48, 24],
  },
  eventDetailsWrapper: {
    maxWidth: ({ size }) => (size === "large" ? 510 : "100%"),
    display: "flex",
    flexDirection: "column",
    marginBottom: ({ size }) => (size === "large" ? "calc(20vh - 24px)" : 88),
    padding: "0 24px",
    "& > *": {
      marginBottom: 24,
    },
  },
  eventDetailsDivider: {
    height: 1,
    alignSelf: "stretch",
    backgroundColor: theme.colors.divider.base.backgroundColor,
    width: ({ size }) => (size === "large" ? "100%" : "100vw"),
    marginLeft: ({ size }) => (size === "large" ? 0 : -24),
  },
  horizontalInputs: {
    display: "grid",
    gridTemplateColumns: ({ size }) => (size === "large" ? "1fr 1fr" : "1fr"),
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
        width: "100vw",
        backgroundColor: theme.colors.background.base.backgroundColor,
        padding: "16px 48px 24px 48px",
        margin: 0,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.10)",
      };
    }
  },
  background: ({ size }) =>
    size === "large"
      ? {
        height: "90vh",
        width: "90vh",
        position: "fixed",
        bottom: "-20vh",
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
    } else {
      return {
        marginBottom: 112,
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
      : {
        minHeight: 350,
      },
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
    marginTop: 24,
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
    marginTop: ({ size }) => (size !== "large" ? 60 : 0),
    "& > h2": {
      ...theme.typography.subheading,
    },
  },
  emptySearchIconWrapper: {
    width: 72,
    height: 72,
    boxSizing: "content-box",
    padding: ({ size }) => (size === "large" ? 36 : 24),
    backgroundColor: "rgba(103, 152, 248, 0.25)",
    display: "inline-block",
    borderRadius: "50%",
    "& > span": {
      color: theme.colors.primary.base.backgroundColor,
    },
  },
  searchResultSpinner: {
    display: "grid",
    padding: 18,
    placeContent: "center",
  },
  '@keyframes fabIn': {
    "0%": {
      transform: 'scale(0)'
    }, "50%": {
      transform: 'scale(1.5)'
    }, "100%": {
      transform: 'scale(1)'
    }
  },
  nextFAB: {
    position: "fixed",
    right: ({ size }) => size === "large" ? "10vw" : 24,
    bottom: ({ size }) => size === "large" ? 64 : 112,
    zIndex: 10,
    animationName: '$fabIn',
    animationTimingFunction: theme.transitions.easing.default,
    animationDuration: 600
  }
}));

export interface CreateEventPageComponentProps { }

export interface EventDetailsObject {
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
  const [eventDetails, setEventDetails] = useState<EventDetailsObject>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    location_type: "outdoor",
    distancing: "6",
    food: "none",
    masks: "1me",
  });
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
      eventDetails.title?.length === 0
      || eventDetails.date?.length === 0
      || eventDetails.time?.length === 0
      || eventDetails.location_type?.length === 0
      || eventDetails.location?.length === 0
      || eventDetails.distancing?.length === 0,
      invitees.length === 0,
    ]);
  };

  const handleInviteesChange = (invitees: UserObject[]) => {
    setInvitees(invitees);
    setStepperDisabled([
      false,
      eventDetails.title?.length === 0
      || eventDetails.date?.length === 0
      || eventDetails.time?.length === 0
      || eventDetails.location_type?.length === 0
      || eventDetails.location?.length === 0
      || eventDetails.distancing?.length === 0,
      invitees.length === 0,
    ]);
  };

  return (
    <Content
      toolbar={
        <Toolbar
          className={classes.toolbar}
          title="Create Event"
          size={size === "large" ? "large" : "normal"}
          start={
            <IconButton icon="arrow_back" onClick={() => history.goBack()} />
          }
          background="filled"
        />
      }
    >
      <Helmet title="Create Event" />
      <Stepper
        className={classes.stepper}
        disabled={stepperDisabled}
        activeStep={activeStep}
        onChange={(step: number) => setActiveStep(step)}
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
      {(activeStep < 2 && !stepperDisabled[activeStep + 1]) && <FAB className={classes.nextFAB} size="medium" icon="arrow_forward" onClick={() => setActiveStep(activeStep + 1)} />}
      <Background className={classes.background} />
    </Content>
  );
};

interface SetEventDetailsProps {
  className?: string;
  eventDetails: EventDetailsObject;
  setEventDetails: (eventDetails: EventDetailsObject) => void;
}

export function SetEventDetails(props: SetEventDetailsProps) {
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
    props.setEventDetails({ ...props.eventDetails, [key]: value });
  };

  return (
    <div className={`${classes.eventDetailsWrapper} ${props.className ?? ""}`}>
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
        value={props.eventDetails.location_type}
        label="Location Type"
        onChange={(value) => updateEventDetails("location_type", value)}
      >
        <option value="outdoor">Outdoor</option>
        <option value="indoor">Indoor</option>
        <option value="remote">Remote</option>
      </Select>
      <div className={classes.eventDetailsDivider} />
      <Select
        value={props.eventDetails.masks}
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
        min={1}
        max={12}
        units={
          parseInt(props.eventDetails.distancing ?? "") === 1 ? "foot" : "feet"
        }
      />
      <div className={classes.eventDetailsDivider} />
      <Select
        value={props.eventDetails.food}
        label="Is food being served?"
        onChange={(value) => updateEventDetails("food", value)}
      >
        <option value="none">No food allowed</option>
        <option value="ss">Yes, Self-serve</option>
        <option value="pp">Yes, Pre-packaged</option>
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
    if (email.length > 0) {
      makeRequest(email);
    }
  };

  const addInvitee = (add: UserObject) => {
    const newInviteeList = props.invitees;
    newInviteeList.push(add);
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
        <div className={classes.searchBarWrapper}>
          <Input
            label="search"
            type="search"
            placeholder="Invite with email address"
            value={query}
            onChange={(value) => debounce(value)}
          />
        </div>
        {query.length > 0 ? (
          <>
            <h2 className={classes.sectionHeader}>Results</h2>
            <List
              type={size === "large" ? "contain" : "fill"}
              className={classes.searchResultList}
            >
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
      {(size === "large" || props.invitees.length > 0) && (
        <div className={classes.inviteesPanel}>
          <h2 className={classes.sectionHeader}>
            Invitees ({props.invitees.length})
          </h2>
          <List
            type={size === "large" ? "contain" : "fill"}
            className={classes.inviteesList}
          >
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
      )}
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

function SendInvitations(props: SendInvitationsProps) {
  const size = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size });
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  async function submitEvent(eventObject: EventDetailsObject) {
    setLoading(true);

    const social_distancing_masks =
      eventObject.masks === "none" ? null : eventObject.distancing;
    const social_distancing_no_masks =
      eventObject.masks === "none" ? eventObject.distancing : null;

    const res = await API.post<CreateEventResponse>("events", {
      title: eventObject.title,
      host_id: User.user?.id,
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
      social_distancing_masks,
      social_distancing_no_masks,
    });

    if (res.error) {
      setLoading(false);
      alert("that didn't work");
    } else {
      inviteUsers(res.data.id as number);
    }
  }

  async function inviteUsers(id: number) {
    await API.post(`events/${id}/invitees`, {
      user_ids: props.invitees.map((invitee) => invitee.id),
    });
    setLoading(false);
    history.push(`/events/${id}`);
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
        loading={loading}
        onClick={() => submitEvent(props.eventDetails)}
        className={classes.giantFAB}
        size="giant"
      />
    </div>
  );
}

export default CreateEventPage;

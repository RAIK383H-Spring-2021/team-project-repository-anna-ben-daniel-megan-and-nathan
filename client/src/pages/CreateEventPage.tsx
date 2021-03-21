import { FC, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createUseStyles, ThemeProvider, useTheme } from "react-jss";
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
            }
        }
    },
    eventDetailsWrapper: {
        width: 510,
        display: "flex",
        flexDirection: "column",
        marginBottom: "10vh",
        "& > *": {
            marginBottom: 24,
        }
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
            }
        } else {
            return {
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 5,
            }
        }
    },
    background: ({ size }) => size === "large" ? {
        height: "90vh",
        width: "90vh",
        position: "fixed",
        top: "-20vh",
        right: "-20vh",
        zIndex: 1,
    } : {},
    addParticipantsWrapper: ({ size }) => {
        if (size === "large") {
            return {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: 60,
                width: "100%",
                marginRight: "20vw",
                marginLeft: "calc(20vw + ((60vw - (60px * 3)) / 4))",
            }
        }
    },
    searchPanel: ({ size }) => size === "large" ? {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
    } : {},
    inviteesPanel: ({ size }) => size === "large" ? {
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
    } : {},
    sectionHeader: {
        ...theme.typography.preTitle,
        marginLeft: 28,
        marginBottom: 12,
    },
    inviteesList: ({ size }) => size === "large" ? {
        flexGrow: 1,
        backgroundColor: theme.colors.background.base.backgroundColor,
    } : {},
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
        }
    },
    giantFAB: {
        padding: "56px 52px 56px 60px",
        width: 184,
        height: 184,
        borderRadius: 92,
        marginTop: 36,
        "&>*": {
            fontSize: 72,
        }
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
        }
    },
    emptySearchIconWrapper: {
        padding: 36,
        backgroundColor: "rgba(103, 152, 248, 0.25)",
        display: "inline-block",
        borderRadius: "50%",
        "& > span": {
            color: theme.colors.primary.base.backgroundColor,
            opacity: 1.0,
        }
    },
}));

export interface CreateEventPageComponentProps { }

interface EventDetailsObject {
    title: string | undefined,
    description: string | undefined,
    date_time: string | undefined,
    location: string | undefined,
    location_type: string | undefined,
    masks: string | undefined,
    distancing: string | undefined,
    food: string | undefined,
}

const CreateEventPage: FC<CreateEventPageComponentProps> = (props) => {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [eventDetails, setEventDetails] = useState<EventDetailsObject>({
        title: undefined,
        description: undefined,
        date_time: undefined,
        location: undefined,
        location_type: undefined,
        masks: undefined,
        distancing: undefined,
        food: undefined,
    });
    const [invitees, setInvitees] = useState<UserObject[]>([]);

    const [stepperDisabled, setStepperDisabled] = useState<boolean[]>([false, true, true]);

    const handleEventDetailsChange = (eventDetails: EventDetailsObject) => {
        setEventDetails(eventDetails);
        setStepperDisabled([
            false,
            eventDetails.title === undefined || eventDetails.title.length === 0,
            invitees.length === 0,
        ]);
    }

    const handleInviteesChange = (invitees: UserObject[]) => {
        setInvitees(invitees);
        setStepperDisabled([
            false,
            eventDetails.title === undefined || eventDetails.title.length === 0,
            invitees.length === 0,
        ]);
    }

    return (
        <Content
            toolbar={
                <Toolbar
                    title="Create Event"
                    size="large"
                    start={
                        <IconButton
                            icon="arrow_back"
                            onClick={() => history.goBack()}
                        />
                    }
                />
            }
        >
            <Stepper className={classes.stepper} disabled={stepperDisabled} onChange={(step) => setActiveStep(step)} />
            <div className={classes.wrapper}>
                {
                    activeStep === 0 ?
                        <SetEventDetails eventDetails={eventDetails} setEventDetails={eventDetails => handleEventDetailsChange(eventDetails)} />
                        : activeStep === 1 ?
                            <AddParticipants invitees={invitees} setInvitees={invitees => handleInviteesChange(invitees)} />
                            :
                            <SendInvitations eventDetails={eventDetails} invitees={invitees} />
                }
            </div>
            <Background className={classes.background} />
        </Content>
    );
};

interface SetEventDetailsProps {
    eventDetails: EventDetailsObject,
    setEventDetails: (eventDetails: EventDetailsObject) => void,
}

function SetEventDetails(props: SetEventDetailsProps) {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });

    const updateEventDetails = (key: "title" | "description" | "date_time" | "location" | "location_type" | "masks" | "distancing" | "food", value: string) => {
        const newEventDetails = props.eventDetails;
        newEventDetails[key] = value;
        props.setEventDetails(newEventDetails);
    }

    return (
        <div className={classes.eventDetailsWrapper}>
            <Input type="text" label="Title" value={props.eventDetails.title} onChange={value => updateEventDetails("title", value)} />
            <Input type="text" label="Description" value={props.eventDetails.description} onChange={value => updateEventDetails("description", value)} />
            <div className={classes.eventDetailsDivider} />
            <div className={classes.horizontalInputs}>
                <Input type="date" label="Date" value={props.eventDetails.location} onChange={value => updateEventDetails("location", value)} />
                <Input type="time" label="Time" value={props.eventDetails.location} onChange={value => updateEventDetails("location", value)} />
            </div>
            <div className={classes.eventDetailsDivider} />
            <Input type="text" label="Address" value={props.eventDetails.location} onChange={value => updateEventDetails("location", value)} />
            <Select label="Location Type">
                <option>Outdoor</option>
                <option>Indoor</option>
                <option>Remote</option>
            </Select>
            <div className={classes.eventDetailsDivider} />
            <Select label="Mask Wearing" caption="CDC guidance recommends that double masking occur to prevent the spread of COVID-19.">
                <option>Double mask, enforced</option>
                <option>Double mask, recommended</option>
                <option>Single mask, enforced</option>
                <option>Single mask, recommended</option>
                <option>No masks</option>
            </Select>
            <Select label="Social Distancing">
                <option>6 feet, enforced</option>
                <option>6 feet, recommended</option>
                <option>12 feet, enforced</option>
                <option>12 feet, recommended</option>
                <option>No requirement</option>
            </Select>
            <div className={classes.eventDetailsDivider} />
            <Select label="Is food being served?">
                <option>Yes, Self-serve</option>
                <option>Yes, Pre-packaged</option>
                <option>No food allowed</option>
            </Select>
        </div>
    );
}

interface UserObject {
    first_name: string,
    last_name: string,
    email: string,
}

interface AddParticipantsProps {
    invitees: UserObject[],
    setInvitees: (invitees: UserObject[]) => void,
}

function AddParticipants(props: AddParticipantsProps) {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });
    const [query, setQuery] = useState("");

    const users: UserObject[] = [
        {
            first_name: "Ben",
            last_name: "Lohrman",
            email: "bwlohrman@gmail.com",
        },
        {
            first_name: "Daniel",
            last_name: "Noon",
            email: "delpinothedragon1@gmail.com",
        },
        {
            first_name: "Anna",
            last_name: "Krueger",
            email: "anna.r.krueger1@gmail.com",
        },
        {
            first_name: "Megan",
            last_name: "Chaffey",
            email: "mchaffey11@gmail.com",
        },
        {
            first_name: "Nathan",
            last_name: "Gentry",
            email: "gentryn31@gmail.com",
        },
    ];

    const search = (query: string) => {
        if (query.length > 1) {
            const usersList = users
                .filter((user) => (props.invitees.length === 0 || props.invitees.filter(invitee => invitee.email === user.email).length === 0))
                .filter((user) => (user.email.search(query) > -1));
            if (query.indexOf("@") > -1 && query.indexOf(".") > query.indexOf("@")) {
                usersList.push({
                    first_name: "",
                    last_name: "",
                    email: query,
                });
            }
            return usersList;
        } else {
            return [];
        }
    }

    const addInvitee = (add: UserObject) => {
        const newInviteeList = props.invitees;
        newInviteeList.push(add);
        console.log(newInviteeList);
        props.setInvitees(newInviteeList);
        setQuery("");
    }

    const removeInvitee = (remove: UserObject) => {
        let newInviteeList = props.invitees;
        newInviteeList = newInviteeList.filter(invitee => invitee.email !== remove.email);
        props.setInvitees(newInviteeList);
    }

    return (
        <div className={classes.addParticipantsWrapper}>
            <div className={classes.searchPanel}>
                <Input type="search" placeholder="Invite with email address" value={query} onChange={value => setQuery(value)} />
                {query.length > 0 ?
                    <>
                        <h2 className={classes.sectionHeader}>Results</h2>
                        <List type="contain">
                            {search(query).map(user => {
                                if (user.first_name.length === 0) {
                                    return <ListItem end={<IconButton icon="add" onClick={() => { addInvitee(user) }} />} key={user.email}>{user.email}</ListItem>;
                                } else {
                                    return <ListItem subtitle={user.email} end={<IconButton icon="add" onClick={() => { addInvitee(user) }} />} key={user.email}>{user.first_name} {user.last_name}</ListItem>;
                                }
                            })}
                        </List>
                    </>
                    :
                    <div className={classes.emptySearchStateContainer}>
                        <div className={classes.emptySearchIconWrapper}>
                            <Icon name="search" size="giant" />
                        </div>
                        <h2>Start typing an email address to invite people to your event</h2>
                    </div>
                }
            </div>
            <div className={classes.inviteesPanel}>
                <h2 className={classes.sectionHeader}>Invitees ({props.invitees.length})</h2>
                <List type="contain" className={classes.inviteesList}>
                    {props.invitees.map(invitee => {
                        if (invitee.first_name.length === 0) {
                            return <ListItem end={<IconButton icon="delete" onClick={() => { removeInvitee(invitee) }} />} key={invitee.email}>{invitee.email}</ListItem>;
                        } else {
                            return <ListItem subtitle={invitee.email} end={<IconButton icon="delete" onClick={() => { removeInvitee(invitee) }} />} >{invitee.first_name} {invitee.last_name}</ListItem>;
                        }
                    })}
                </List>
            </div>
        </div>
    )
}

interface SendInvitationsProps {
    eventDetails: EventDetailsObject,
    invitees: UserObject[],
}

function SendInvitations(props: SendInvitationsProps) {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });

    return (
        <div className={classes.sendInvitationsWrapper}>
            <h2 className={classes.sendConfirmation}>
                Send invitations for
                <br />
                <span>{props.eventDetails.title}</span>
                <br />
                to {props.invitees.length} {props.invitees.length === 1 ? "person" : "people"}
            </h2>
            <FAB icon="send" className={classes.giantFAB} size="giant" />
        </div>
    );
}

export default CreateEventPage;

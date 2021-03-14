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
    } : {},
    inviteesPanel: ({ size }) => size === "large" ? {
        height: "60vh",
        display: "flex",
        flexDirection: "column",
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
    }
}));

export interface CreateEventPageComponentProps { }

export const CreateEventPage: FC<CreateEventPageComponentProps> = (props) => {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);

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
            <Stepper className={classes.stepper} disabled={[false, false, false]} onChange={(step) => setActiveStep(step)} />
            <div className={classes.wrapper}>
                {
                    activeStep === 0 ?
                        <SetEventDetails />
                        : activeStep === 1 ?
                            <AddParticipants />
                            :
                            <SendInvitations />
                }
            </div>
            <Background className={classes.background} />
        </Content>
    );
};

function SetEventDetails() {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });

    return (
        <div className={classes.eventDetailsWrapper}>
            <Input type="text" label="Name" />
            <Input type="text" label="Description" />
            <div className={classes.eventDetailsDivider} />
            <div className={classes.horizontalInputs}>
                <Input type="date" label="Date" />
                <Input type="time" label="Time" />
            </div>
            <div className={classes.eventDetailsDivider} />
            <Input type="text" label="Address" />
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
                <option>6 feet, recommended</option>
            </Select>
            <div className={classes.eventDetailsDivider} />
            <Select label="Is food being served?">
                <option>Yes, Self-serve</option>
                <option>Yes, Pre-packaged</option>
                <option>No, Bring your own food</option>
                <option>No food allowed</option>
            </Select>
        </div>
    );
}

function AddParticipants() {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });

    return (
        <div className={classes.addParticipantsWrapper}>
            <div className={classes.searchPanel}>
                <Input type="search" placeholder="Invite with email address" />
                <h2 className={classes.sectionHeader}>Results</h2>
                <List type="contain">
                    <ListItem subtitle="firstlast@email.com" end={<IconButton icon="add" />}>First Last</ListItem>
                    <ListItem end={<IconButton icon="add" />}>unknown@email.com</ListItem>
                </List>
            </div>
            <div className={classes.inviteesPanel}>
                <h2 className={classes.sectionHeader}>Invitees (1)</h2>
                <List type="contain" className={classes.inviteesList}>
                    <ListItem subtitle="gentryn31@gmail.com" end={<IconButton icon="delete" />}>Nathan Gentry</ListItem>
                </List>
            </div>
        </div>
    )
}

function SendInvitations() {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size });

    return (
        <div className={classes.sendInvitationsWrapper}>
            <h2 className={classes.sendConfirmation}>
                Send invitations for
                <br />
                <span>Event Name</span>
                <br />
                to 43 people
            </h2>
            <FAB icon="send" className={classes.giantFAB} />
        </div>
    );
}
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

const useStyles = createUseStyles((theme: AppTheme) => ({
    wrapper: ({ size }) => {
        if (size === "large") {
            return {
                position: "relative",
                top: "20vh",
                width: 510,
                margin: "auto",
            }
        }
    },
    eventDetailsWrapper: {
        display: "flex",
        flexDirection: "column",
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
        display: "flex",
        flexDirection: "row",
        "& > *": {
            flexGrow: 1,
        },

    },
    stepper: ({ size }) => {
        if (size === "large") {
            return {
                position: "fixed",
                top: "20vh",
                left: 180
            }
        } else {
            return {
                position: "fixed",
                bottom: 0,
                left: 0,
            }
        }
    },
    background: ({ size }) => size === "large" ? {
        height: "90vh",
        width: "90vh",
        position: "fixed",
        top: "-20vh",
        right: "-20vh",
    } : {},
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
            <Stepper className={classes.stepper} disabled={[false, false, true]} onChange={(step) => setActiveStep(step)} />
            <div className={classes.wrapper}>
                {
                    activeStep === 0 ?
                        <SetEventDetails />
                        : activeStep === 1 ?
                            <div>Add participants</div>
                            :
                            <div>Send invitations</div>
                }
            </div>
            <Background className={classes.background} />
        </Content>
    );
};

function SetEventDetails() {
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme });

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
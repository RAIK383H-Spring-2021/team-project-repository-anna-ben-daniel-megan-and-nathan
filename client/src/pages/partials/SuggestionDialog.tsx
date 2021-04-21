import { FC, useState, useEffect } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Toolbar } from "../../components/Toolbar";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { AppTheme } from "../../theme";
import { Select } from "../../components/Select";
import { Slider } from "../../components/Slider";
import { Dialog } from "../../components/Dialog";
import { ISuggestion } from "../EventDetailsPage";

const useStyles = createUseStyles((theme: AppTheme) => ({
    wrapper: {},
    toolbar: {},
    suggestionsWrapper: {
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
        "& > *": {
            margin: "12px 0",
        },
    },
    divider: {
        margin: "12px -34px",
        width: "100%",
        height: 1,
        backgroundColor: theme.colors.divider.base.backgroundColor,
    },
}));

export interface SuggestionDialogComponentProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (s: ISuggestion) => void,
    suggestion?: ISuggestion,
}

export const SuggestionDialog: FC<SuggestionDialogComponentProps> = (props) => {
    const { open, onClose, onSubmit, suggestion } = props;
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme });

    const [validForm, setValidForm] = useState(true);
    const [data, updateData] = useState<ISuggestion>({
        location_type: "",
        masks: "",
        distancing: "",
        room_size: "",
        food: "",
        score: "",
    });

    useEffect(() => {
        if (suggestion) {
            updateData(suggestion);
        }
    }, [suggestion]);

    const updateSuggestionData = (
        key: "location_type"
            | "masks"
            | "distancing"
            | "room_size"
            | "food",
        value: string
    ) => {
        updateData({ ...data, [key]: value });
        value.length === 0 ? setValidForm(false) : setValidForm(true);
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <Toolbar
                className={classes.toolbar}
                background="filled"
                title="Suggestions"
                start={<IconButton onClick={onClose} icon="close" />}
                end={
                    <Button
                        onClick={() => onSubmit(data)}
                        color="accent"
                        disabled={!validForm}
                    >
                        Accept
                    </Button>
                }
            />
            <div className={classes.suggestionsWrapper}>
                <div>
                    <Select
                        value={data.location_type}
                        label="Location Type"
                        onChange={(value) => {
                            updateSuggestionData("location_type", value)
                        }}
                    >
                        <option value="outdoor">Outdoor</option>
                        <option value="indoor">Indoor</option>
                        <option value="remote">Remote</option>
                    </Select>
                    <p>Activities</p>
                </div>
                {data.location_type !== "remote" &&
                    <>
                        <div className={classes.divider} />
                        <Select
                            value={data.masks}
                            label="Mask Wearing"
                            onChange={(value) => {
                                updateData({ ...data, masks: value });
                            }}
                        >
                            <option value="1me">Masks required</option>
                            <option value="none">No masks</option>
                        </Select>
                        <Slider
                            label="Social Distancing"
                            min={1}
                            max={12}
                            onChange={(value) => {
                                const roomSize = (parseInt(data.room_size ? data.room_size : "") / (parseInt(data.distancing ? data.distancing : "") ** 2)) * (parseInt(value) ** 2);
                                updateData({ ...data, distancing: value, room_size: roomSize.toString() });
                            }}
                            units={"feet"}
                            value={data.distancing}
                        />
                        {data.location_type === "indoor" &&
                            <>
                                <p>To host your event with {data.distancing} feet of distancing, you will need a venue with {data.room_size} square feet.</p>
                                <p>A room size of {suggestion?.room_size} square feet is recommended for maximum guest comfort.</p>
                            </>
                        }
                        <div className={classes.divider} />
                        <Select
                            value={data.food}
                            label="Is food being served?"
                            onChange={(value) => {
                                updateSuggestionData("food", value)
                            }}
                        >
                            <option value="none">No food allowed</option>
                            <option value="ss">Yes, Self-serve</option>
                            <option value="pp">Yes, Pre-packaged</option>
                        </Select>
                    </>
                }
            </div>
        </Dialog >
    );
};
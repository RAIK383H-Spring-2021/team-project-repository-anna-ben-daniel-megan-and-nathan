import { FC, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Toolbar } from "../../components/Toolbar";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { AppTheme } from "../../theme";
import { Select } from "../../components/Select";
import { Slider } from "../../components/Slider";
import { Dialog } from "../../components/Dialog";

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
        width: "calc(100% + (34px * 2))",
        height: 1,
        backgroundColor: theme.colors.divider.base.backgroundColor,
    },
}));

export interface ISuggestion {
    location_type: string,
    masks: string,
    distancing: string,
    room_size: string,
    food: string,
}

export interface SuggestionDialogComponentProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (s: ISuggestion) => void,
}

export const SuggestionDialog: FC<SuggestionDialogComponentProps> = (props) => {
    const { open, onClose, onSubmit } = props;
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme });

    const [validForm, setValidForm] = useState(true);
    const [data, updateData] = useState({
        location_type: "outdoor",
        masks: "none",
        distancing: "6",
        room_size: "300",
        food: "pp",
    });

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
                <div className={classes.divider} />
                <Select
                    value={data.masks}
                    label="Mask Wearing"
                    onChange={(value) => {
                        updateSuggestionData("masks", value)
                    }}
                >
                    <option value="1me">Masks required</option>
                    <option value="none">No masks</option>
                </Select>
                <Slider
                    label="Social Distancing"
                    min={0}
                    max={12}
                    onChange={(value) => {
                        updateSuggestionData("distancing", value)
                    }}
                    units={"feet"}
                    value={data.distancing}
                />
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
            </div>
        </Dialog>
    );
};
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
  toolbar: {
    position: "sticky",
    top: "-2px",
    borderRadius: "8px 8px 0 0",
  },
  suggestionsWrapper: {
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    "& > *:not(hr)": {
      margin: "12px 0",
    },
  },
  divider: {
    margin: "16px -20px",
    width: "calc(100% + (20px * 2))",
    height: 1,
    border: "none",
    backgroundColor: theme.colors.divider.base.backgroundColor,
  },
  suggestedActivities: {
    "& > h4": {
      ...theme.typography.preTitle,
      marginBottom: 6,
    },
    "& > ul": {
      paddingLeft: 16
    }
  }
}));

export interface SuggestionDialogComponentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (s: ISuggestion) => void;
  suggestion?: ISuggestion;
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

  useEffect(() => {
    setValidForm(!(
      data.distancing?.length === 0
    ));
  }, [data])

  const updateSuggestionData = (
    key: "location_type" | "masks" | "distancing" | "room_size" | "food",
    value: string
  ) => {
    updateData({ ...data, [key]: value });
    value.length === 0 ? setValidForm(false) : setValidForm(true);
  };

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
              updateSuggestionData("location_type", value);
            }}
          >
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
            <option value="remote">Remote</option>
          </Select>
          <div className={classes.suggestedActivities}>
            {
              data.location_type === "outdoor"
                ?
                <>
                  <h4>Suggested Outdoor Activities</h4>
                  <ul>
                    <li>Play basketball</li>
                    <li>Throw a frisbee</li>
                    <li>Picnic in the park</li>
                    <li>Go swimming</li>
                  </ul>
                </>
                : data.location_type === "indoor"
                  ?
                  <>
                    <h4>Suggested Indoor Activities</h4>
                    <ul>
                      <li>Play a board game</li>
                      <li>Watch a movie</li>
                      <li>Do arts and crafts</li>
                      <li>Gift exchange</li>
                    </ul>
                  </>
                  :
                  <>
                    <h4>Suggested Remote Activities</h4>
                    <ul>
                      <li>Host a trivia night</li>
                      <li>Virtual happy hour</li>
                      <li>Play an online game</li>
                      <li>Virtual dance party</li>
                    </ul>
                  </>
            }
          </div>
        </div>
        {data.location_type !== "remote" && (
          <>
            <hr className={classes.divider} />
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
                const roomSize =
                  (parseInt(data.room_size ? data.room_size : "") /
                    parseInt(data.distancing ? data.distancing : "") ** 2) *
                  parseInt(value) ** 2;
                updateData({
                  ...data,
                  distancing: value,
                  room_size: roomSize.toString(),
                });
              }}
              units={"feet"}
              value={data.distancing}
            />
            {data.location_type === "indoor" && (
              <>
                <p>
                  To host your event with {data.distancing} feet of distancing,
                  you will need a venue with {data.room_size} square feet.
                </p>
              </>
            )}
            <hr className={classes.divider} />
            <Select
              value={data.food}
              label="Is food being served?"
              onChange={(value) => {
                updateSuggestionData("food", value);
              }}
            >
              <option value="none">No food allowed</option>
              <option value="ss">Yes, Self-serve</option>
              <option value="pp">Yes, Pre-packaged</option>
            </Select>
          </>
        )}
      </div>
    </Dialog >
  );
};

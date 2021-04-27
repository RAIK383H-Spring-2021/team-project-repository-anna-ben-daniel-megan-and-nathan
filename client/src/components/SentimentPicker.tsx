import { FC, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";
import { Button } from "./Button";
import { Icon } from "./Icon";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "grid",
  },
  control: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 50,
    height: 50,
    border: ({ color }) =>
      `2px solid ${theme.colors[color].base.backgroundColor}`,
    borderRadius: 50,
    display: "grid",
    padding: 0,
    margin: 0,
    transitionDuration: theme.transitions.timing.short,
    transitionTimingFunction: "linear",
  },
  line: {
    height: 0,
    border: ({ color }) =>
      `1px solid ${theme.colors[color].base.backgroundColor}`,
    backgroundColor: ({ color }) =>
      `1px solid ${theme.colors[color].base.backgroundColor}`,
    flex: "1 1 auto",
    marginBottom: 22,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  labelValue: {
    userSelect: "none",
    marginTop: 12,
    ...theme.typography.preTitle,
    cursor: "pointer",
  },
  primaryLabel: {
    margin: "12px 0",
  },
}));

export interface SentimentPickerComponentProps {
  label: string;
  value: number;
  color?: "primary" | "secondary" | "accent";
  disabled?: boolean;
  onChange?: (value: number) => void;
}

const options = [
  { icon: "sentiment_very_dissatisfied", value: 1 },
  {},
  { icon: "sentiment_dissatisfied", value: 2 },
  {},
  { icon: "sentiment_satisfied", value: 3 },
  {},
  { icon: "sentiment_satisfied_alt", value: 4 },
  {},
  { icon: "sentiment_very_satisfied", value: 5 },
];

export const SentimentPicker: FC<SentimentPickerComponentProps> = (props) => {
  const {
    label,
    value = 0,
    onChange = () => {},
    color = "primary",
    disabled = false,
  } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color });

  const [val, setVal] = useState(value);

  function update(val: number) {
    if (!disabled) {
      setVal(val);
      onChange(val);
    }
  }

  return (
    <div>
      <div className={classes.primaryLabel}>
        <label>{label}</label>
      </div>
      <div className={classes.control}>
        {options.map((option, i) =>
          option?.icon ? (
            <label key={i} className={classes.label}>
              <Button
                onClick={() => update(option.value)}
                className={classes.button}
                color="primary"
                transparent={val !== option.value}
              >
                <Icon name={option.icon} />
              </Button>
              <span className={classes.labelValue}>{option.value}</span>
            </label>
          ) : (
            <div key={i} className={classes.line}></div>
          )
        )}
      </div>
      {/* <div >
        {[1, 2, 3, 4, 5].map((i) => (
          <label key={i} onClick={() => update(i)} className={classes.label}>
            {i}
          </label>
        ))}
      </div> */}
    </div>
  );
};

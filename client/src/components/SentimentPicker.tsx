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
    flex: "1 1 auto",
  },
  labels: {
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 20px",
  },
  label: {
    userSelect: "none",
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
  color: "primary" | "secondary" | "accent";
  onChange: (value: number) => void;
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
  const { label, value = 0, onChange, color = "primary" } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color });

  const [val, setVal] = useState(value);

  function update(val: number) {
    setVal(val);
    onChange(val);
  }

  return (
    <div>
      <div className={classes.primaryLabel}>
        <label>{label}</label>
      </div>
      <div className={classes.control}>
        {options.map((option, i) =>
          option?.icon ? (
            <Button
              onClick={() => update(option.value)}
              className={classes.button}
              color="primary"
              transparent={val !== option.value}
            >
              <Icon name={option.icon} />
            </Button>
          ) : (
            <div key={i} className={classes.line}></div>
          )
        )}
      </div>
      <div className={classes.labels}>
        {[1, 2, 3, 4, 5].map((i) => (
          <label key={i} onClick={() => update(i)} className={classes.label}>
            {i}
          </label>
        ))}
      </div>
    </div>
  );
};

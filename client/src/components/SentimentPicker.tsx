import { FC, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";
// import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

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
    border: `4px solid ${theme.colors.primary.base.backgroundColor}`,
    borderRadius: 50,
    display: "grid",
  },
  line: {
    height: 0,
    border: `1px solid ${theme.colors.primary.base.backgroundColor}`,
    flex: "1 1 auto",
  },
}));

export interface SentimentPickerComponentProps {
  label: string;
  value: number;
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
  const { label, value, onChange } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const [val, setVal] = useState(value);

  console.log(val);

  function update(val: number) {
    setVal(val);
    onChange(val);
  }

  return (
    <div>
      <label>{label}</label>
      <div className={classes.control}>
        {options.map((option, i) =>
          option?.icon ? (
            <IconButton
              onClick={() => update(option.value)}
              icon={option.icon}
            />
          ) : (
            <div key={i} className={classes.line}></div>
          )
        )}
      </div>
    </div>
  );
};

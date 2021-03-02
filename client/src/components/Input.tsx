import { ChangeEvent, FC, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    ...theme.typography.preTitle,
  },
  input: {
    margin: "4px 0",
    padding: "12px 18px",
    ...theme.colors.background.light,
    ...theme.typography.body,
    border: `1px solid ${theme.colors.divider.base.color}`,
    borderRadius: 4,
    position: "relative",
    height: 44,

    "&:hover": {
      border: `1px solid ${theme.colors.primary.light?.backgroundColor}`,
    },

    "&:focus": {
      border: `1px solid ${theme.colors.primary.base.backgroundColor}`,
      outline: "none",
    },

    "&[disabled]": {
      background: theme.colors.divider.base.backgroundColor,
      cursor: "not-allowed",

      "&:hover": {
        border: `1px solid ${theme.colors.divider.base.color}`,
      },
    },

    "&::-webkit-calendar-picker-indicator": {
      color: "transparent",
      background: "none",
      zIndex: 1,
      height: 18,
      width: 18,
      cursor: "pointer",

      "&:focus": {
        outline: "none",
        border: "none",
      },
    },

    '&[type="date"]': {
      ...theme.typography.body,

      "&:before": {
        ...theme.colors.background.base,
        backgroundColor: "transparent",
        content: "'today'",
        fontFamily: "Material Icons",
        width: 18,
        height: 18,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        right: 16,
        top: 12,
      },
    },

    '&[type="time"]': {
      ...theme.typography.body,

      "&:before": {
        ...theme.colors.background.base,
        backgroundColor: "transparent",
        content: "'schedule'",
        fontFamily: "Material Icons",
        width: 18,
        height: 18,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        right: 16,
        top: 12,
      },
    },
  },
  captionWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  caption: {
    ...theme.typography.caption,
  },
  wordLimit: {
    ...theme.typography.caption,
  },
}));

export interface InputComponentProps {
  type?: "text" | "number" | "date" | "time" | "search";
  label?: string;
  placeholder?: string;
  caption?: string;
  maxLength?: number;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Input: FC<InputComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const [value, setValue] = useState(props.value ?? "");

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
    props.onChange?.(ev.target.value);
  };

  return (
    <div className={`${classes.wrapper} ${props.className ?? ""}`}>
      {props.label && <label className={classes.label}>{props.label}</label>}
      <input
        type={props.type}
        placeholder={props.placeholder}
        className={classes.input}
        maxLength={props.maxLength}
        onChange={(ev) => handleChange(ev)}
        value={value}
        disabled={props.disabled}
      />
      <div className={classes.captionWrapper}>
        <span className={classes.caption}>{props.caption}</span>
        {props.maxLength && (
          <span className={classes.wordLimit}>
            {value.length} / {props.maxLength} characters
          </span>
        )}
      </div>
    </div>
  );
};

import React, { FC, MouseEvent } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    ...theme.typography.button,
    color: ({ color }) => theme.colors[color].base.color,
    backgroundColor: ({ color }) => theme.colors[color].base.backgroundColor,
    border: "none",
    padding: "12px 24px",
    borderRadius: 4,
    cursor: "pointer",
    transitionTimingFunction: theme.transitions.easing.default,
    transitionDuration: theme.transitions.timing.short,

    "&:focus": {
      border: "none",
    },

    "&:hover": {
      color: ({ color }) => theme.colors[color].dark?.color,
      backgroundColor: ({ color }) => theme.colors[color].dark?.backgroundColor,
    },
  },
}));

export interface ButtonComponentProps {
  type: "icon" | "text";
  color: "primary" | "secondary" | "accent";
  size: "small" | "medium" | "large";
  onClick: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<ButtonComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color: props.color });
  return (
    <button className={classes.button} onClick={(ev) => props.onClick(ev)}>
      {props.children}
    </button>
  );
};

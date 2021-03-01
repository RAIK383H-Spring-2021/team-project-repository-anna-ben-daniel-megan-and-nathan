import React, { FC, MouseEvent, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    ...theme.typography.button,
    color: ({ color }) => theme.colors[color].base.color,
    backgroundColor: ({ color }) => theme.colors[color].base.backgroundColor,
    border: "none",
    padding: "11px 24px",
    borderRadius: 4,
    cursor: "pointer",
    transitionTimingFunction: theme.transitions.easing.default,
    transitionDuration: theme.transitions.timing.short,
    position: "relative",
    display: "inline-block",
    overflow: "hidden",

    "&:focused": {
      border: "none",
    },

    "&:active": {
      border: "none",
    },
  },
}));

export interface ButtonComponentProps {
  color?: "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large";
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<ButtonComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color: props.color ?? "primary" });

  const rippleRef = useRef(null);

  useRipple(rippleRef);

  return (
    <button className={classes.button} ref={rippleRef} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

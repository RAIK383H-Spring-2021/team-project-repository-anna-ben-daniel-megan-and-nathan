import React, { FC, MouseEvent, ReactNode, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    ...theme.typography.button,
    color: ({ color }) => theme.colors[color].base.color,
    backgroundColor: ({ color, transparent }) =>
      transparent ? "transparent" : theme.colors[color].base.backgroundColor,
    border: "none",
    padding: "11px 24px",
    borderRadius: 4,
    cursor: "pointer",
    transitionTimingFunction: theme.transitions.easing.default,
    transitionDuration: theme.transitions.timing.short,
    position: "relative",
    display: "inline-flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    textDecoration: "none",

    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  end: {
    marginLeft: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export interface ButtonComponentProps {
  color?: "primary" | "secondary" | "accent" | "background";
  transparent?: boolean;
  size?: "small" | "medium" | "large";
  end?: ReactNode;
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<ButtonComponentProps> = (props) => {
  const {
    color = "primary",
    transparent = false,
    size = "medium",
    end,
  } = props;
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color, transparent, size });

  const rippleRef = useRef(null);

  const colorBase = theme.colors[color].base;

  useRipple(rippleRef, colorBase.color);

  return (
    <button className={classes.button} ref={rippleRef} onClick={props.onClick}>
      {props.children}
      {end && <div className={classes.end}>{end}</div>}
    </button>
  );
};

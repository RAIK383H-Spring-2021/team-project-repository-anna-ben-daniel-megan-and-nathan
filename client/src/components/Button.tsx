import React, { FC, MouseEvent, ReactNode, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const fontSizes = new Map([
  ["large", 18],
  ["medium", 12],
  ["small", 8],
]);

const useStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    ...theme.typography.button,
    color: ({ color, transparent, disabled }) =>
      disabled
        ? theme.colors.divider.base.color
        : color === "black"
        ? "black"
        : color === "white"
        ? "white"
        : transparent
        ? theme.colors[color].base.backgroundColor
        : theme.colors[color].base.color,
    backgroundColor: ({ color, transparent, disabled }) =>
      disabled
        ? "transparent"
        : transparent
        ? "transparent"
        : theme.colors[color].base.backgroundColor,
    border: ({ disabled }) =>
      disabled ? `2px solid ${theme.colors.divider.base.color}` : "none",
    padding: "14px 24px",
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
    fontSize: ({ size }) => fontSizes.get(size),
    lineHeight: 1,

    "&:focus": {
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
  color?: "primary" | "secondary" | "accent" | "background" | "black" | "white";
  transparent?: boolean;
  size?: "small" | "medium" | "large";
  end?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<ButtonComponentProps> = (props) => {
  const {
    color = "primary",
    transparent = false,
    size = "medium",
    end,
    className = "",
    disabled = false,
  } = props;
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color, transparent, size, disabled });

  const rippleRef = useRef(null);

  const colorBase = ["black", "white"].includes(color)
    ? { color }
    : theme.colors[color].base;

  useRipple(rippleRef, colorBase.color);

  return (
    <button
      className={[classes.button, className].join(" ")}
      ref={rippleRef}
      onClick={props.onClick}
      disabled={disabled}
    >
      {props.children}
      {end && <div className={classes.end}>{end}</div>}
    </button>
  );
};

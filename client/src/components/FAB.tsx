import { FC, MouseEvent, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import MDSpinner from "react-md-spinner";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";
import { Icon } from "./Icon";

const useStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    width: 56,
    height: 56,
    backgroundColor: ({ color }) => theme.colors[color].base.backgroundColor,
    color: ({ color }) => theme.colors[color].base.color,
    borderRadius: 32,
    border: "none",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1);",
    transitionDuration: theme.transitions.timing.short,
    transitionTimingFunction: theme.transitions.easing.default,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    pointerEvents: "auto",

    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  spinnerWrapper: {
    height: `100%`,
    width: `100%`,
    display: "grid",
    placeItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

export interface FabComponentProps {
  icon: string;
  color?: "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large" | "giant";
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
}

export const FAB: FC<FabComponentProps> = (props) => {
  const {
    size = "medium",
    color = "accent",
    className,
    // loading = false,
  } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size, color });
  const rippleRef = useRef(null);
  useRipple(rippleRef, theme.colors[color].base.color);

  return (
    <button
      className={`${classes.button} ${className}`}
      ref={rippleRef}
      onClick={props.onClick}
    >
      {false ? (
        <div className={classes.spinnerWrapper}>
          <MDSpinner singleColor={theme.colors[color].base.color} />
        </div>
      ) : (
        <Icon name={props.icon} size={size} />
      )}
    </button>
  );
};

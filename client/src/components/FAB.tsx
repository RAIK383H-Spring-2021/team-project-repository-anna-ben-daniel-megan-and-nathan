import { FC, MouseEvent, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
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

    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
}));

export interface FabComponentProps {
  icon: string;
  color?: "primary" | "secondary" | "accent";
  size?: "small" | "normal" | "large" | "giant";
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const FAB: FC<FabComponentProps> = (props) => {
  const { size = "normal", color = "accent" } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size, color });
  const rippleRef = useRef(null);
  useRipple(rippleRef);

  return (
    <button className={classes.button} ref={rippleRef} onClick={props.onClick}>
      <Icon name={props.icon} />
    </button>
  );
};

import { FC, MouseEvent, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";
import { Icon } from "./Icon";

const useStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    background: "transparent",
    color: ({ color }) =>
      color === "default"
        ? theme.colors.background.base.color
        : theme.colors[color].base.backgroundColor,
    border: "none",
    position: "relative",
    cursor: "pointer",
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: "50%",

    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
}));

export interface IconButtonComponentProps {
  icon: string;
  color?: "primary" | "secondary" | "accent" | "default";
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const IconButton: FC<IconButtonComponentProps> = (props) => {
  const color = props.color ?? "default";

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color });
  const rippleRef = useRef(null);

  useRipple(rippleRef, theme.colors.background.base.color, true);

  return (
    <button className={classes.button} ref={rippleRef} onClick={props.onClick}>
      <Icon name={props.icon} />
    </button>
  );
};

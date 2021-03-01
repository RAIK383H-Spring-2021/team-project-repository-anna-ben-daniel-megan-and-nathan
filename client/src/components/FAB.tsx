import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
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

    "&:focus": {
      border: "none",
      outline: "none",
    },

    "&:hover": {
      backgroundColor: ({ color }) => theme.colors[color].dark?.backgroundColor,
      color: ({ color }) => theme.colors[color].dark?.color,
    },
  },
}));

export interface FabComponentProps {
  icon: string;
  color: "primary" | "secondary" | "accent";
  onClick?: (ev: MouseEvent) => void;
}

export const FAB: FC<FabComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, ...props });

  return (
    <button className={classes.button}>
      <Icon name={props.icon} />
    </button>
  );
};

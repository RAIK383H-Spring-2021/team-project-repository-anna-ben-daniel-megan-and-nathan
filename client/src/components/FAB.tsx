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
    background: theme.colors.accent.base,
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
      background: theme.colors.accent.dark,
    },
  },
}));

export interface FabComponentProps {
  icon: string;
  onClick?: (ev: MouseEvent) => void;
}

export const FAB: FC<FabComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <button className={classes.button}>
      <Icon name={props.icon} />
    </button>
  );
};

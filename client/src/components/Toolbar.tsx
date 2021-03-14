import React, { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  toolbar: {
    ...theme.colors.background,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 0,
    height: 75,
    width: "100%",
    zIndex: 99,
    paddingTop: ({ size }) => size === "large" && 60,
    paddingBottom: ({ size }) => size === "large" && 36,
    paddingLeft: ({ size }) => size === "large" && 180,
    paddingRight: ({ size }) => size === "large" && 180,
  },
  titleStart: {
    ...theme.typography.heading,
    flex: "1 1 auto",
    margin: 0,
  },
  titleNoStart: {
    ...theme.typography.heading,
    flex: "1 1 auto",
    margin: "0 0 0 8px",
  },
  start: {
    marginRight: 12,
  },
}));

export interface ToolbarComponentProps {
  start?: React.ReactNode;
  end?: React.ReactNode;
  tabs?: React.ReactNode;
  title: string;
  size?: "normal" | "large";
  className?: string;
}

export const Toolbar: FC<ToolbarComponentProps> = (props) => {
  const { size = "normal", className } = props;
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, size });

  return (
    <div className={`${classes.toolbar} ${className}`}>
      {props.start && <div className={classes.start}>{props.start}</div>}
      <h1 className={props.start ? classes.titleStart : classes.titleNoStart}>
        {props.title}
      </h1>
      <div>{props.end}</div>
    </div>
  );
};

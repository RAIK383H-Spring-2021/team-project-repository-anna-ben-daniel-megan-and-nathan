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
}

export const Toolbar: FC<ToolbarComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.toolbar}>
      {props.start && <div className={classes.start}>{props.start}</div>}
      <h1 className={props.start ? classes.titleStart : classes.titleNoStart}>
        {props.title}
      </h1>
      <div>{props.end}</div>
    </div>
  );
};

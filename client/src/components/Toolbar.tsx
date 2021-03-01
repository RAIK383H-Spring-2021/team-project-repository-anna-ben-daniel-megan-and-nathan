import React, { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  toolbar: {
    ...theme.colors.background,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "20px 28px 20px 20px",
    margin: 0,
  },
  title: {
    ...theme.typography.heading,
    flex: "1 1 auto",
    margin: "0 20px",
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
      <div>{props.start}</div>
      <h1 className={classes.title}>{props.title}</h1>
      <div>{props.end}</div>
    </div>
  );
};

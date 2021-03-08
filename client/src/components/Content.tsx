import { PropsWithChildren, ReactNode } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useScreen } from "../hooks/useScreen";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  content: {
    display: "grid",
    height: "100%",
    // gridTemplateRows: "150px 1fr",
  },
  scroll: {
    height: "100%",
    overflowY: "auto",
    // paddingBottom: ({ fabExists }) => fabExists && 96,
  },
  toolbar: {
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    ...theme.colors.background.base,
  },
  fabContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    padding: ({ screen }) => (screen === "large" ? 72 : 20),
    flexDirection: "row",
    justifyContent: ({ screen }) =>
      screen === "large" ? "flex-end" : "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  positioner: {
    position: "absolute",
    display: "block",
    height: "100%",
    width: "100%",
  },
}));

interface ContentComponentProps {
  toolbar?: ReactNode;
  fab?: ReactNode;
}

export function Content(props: PropsWithChildren<ContentComponentProps>) {
  const fabExists = !!props.fab;
  const screen = useScreen();

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, fabExists, screen });

  return (
    <div className={classes.positioner}>
      <div className={classes.content}>
        <div className={classes.toolbar}>{props.toolbar}</div>
        <main className={classes.scroll}>{props.children}</main>
        {props.fab && <div className={classes.fabContainer}>{props.fab}</div>}
      </div>
    </div>
  );
}

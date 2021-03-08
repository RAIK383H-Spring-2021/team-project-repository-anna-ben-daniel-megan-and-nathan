import { PropsWithChildren, ReactNode } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  content: {
    display: "grid",
    height: "100vh",
    gridTemplateRows: "150px 1fr",
  },
  scroll: {
    height: "100%",
    overflowY: "scroll",
    paddingBottom: ({ fabExists }) => fabExists && 96,
  },
  fabContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    padding: "20px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));

interface ContentComponentProps {
  toolbar?: ReactNode;
  fab?: ReactNode;
}

export function Content(props: PropsWithChildren<ContentComponentProps>) {
  const fabExists = !!props.fab;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, fabExists });

  return (
    <div className={classes.content}>
      <div>{props.toolbar}</div>
      <main className={classes.scroll}>{props.children}</main>
      {props.fab && <div className={classes.fabContainer}>{props.fab}</div>}
    </div>
  );
}

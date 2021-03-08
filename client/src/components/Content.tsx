import { PropsWithChildren, ReactNode } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  main: {
    overflowY: "auto",
    height: "100%",
  },
  scrollContainer: {
    height: "calc(100%)",
    marginTop: 75,
  },
  toolbar: {
    position: "absolute",
  },
}));

interface ContentComponentProps {
  toolbar?: ReactNode;
  fab?: ReactNode;
}

export function Content(props: PropsWithChildren<ContentComponentProps>) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.wrapper}>
      <div className={classes.toolbar}>{props.toolbar}</div>
      <div className={classes.scrollContainer}>
        <main className={classes.main}>{props.children}</main>
      </div>
    </div>
  );
}

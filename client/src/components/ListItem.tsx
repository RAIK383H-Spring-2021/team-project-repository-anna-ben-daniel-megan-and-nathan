import { FC, ReactNode } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {},
  main: {
    ...theme.typography.body,
  },
}));

export interface ListItemComponentProps {
  start?: ReactNode;
  end?: ReactNode;
}

export const ListItem: FC<ListItemComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.wrapper}>
      {props.start && <div>{props.start}</div>}
      <div className={classes.main}>{props.children}</div>
      {props.end && <div>{props.end}</div>}
    </div>
  );
};

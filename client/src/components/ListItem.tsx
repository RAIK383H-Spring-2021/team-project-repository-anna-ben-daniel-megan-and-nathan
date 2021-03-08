import React, { FC, Fragment, MouseEvent, ReactNode, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    ...theme.colors.background.base,
    ...theme.typography.body,
    outline: "none",
    padding: "16px 28px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderLeft: "none",
    borderRight: "none",
    borderTop: `1px solid ${theme.colors.divider.base.color}`,
    borderBottom: `1px solid ${theme.colors.divider.base.color}`,
    position: "relative",
    cursor: ({ button }) => button && "pointer",
    width: "100%",
    marginTop: -1,
    borderRadius: 0,
    textAlign: "left",

    "&:last-child": {
      borderBottom: "none",
    },

    "&:focus": {
      outline: "none",
    },
  },
  main: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
  },
  start: {
    marginRight: 12,
  },
  end: {
    marginLeft: 12,
  },
  title: {},
  subtitle: {
    ...theme.typography.caption,
  },
}));

export interface ListItemComponentProps {
  start?: ReactNode;
  end?: ReactNode;
  subtitle?: string;
  className?: string;
  button?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ListItem: FC<ListItemComponentProps> = (props) => {
  const { className = "", button = false } = props;
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, button });

  const rippleRef = useRef(null);
  useRipple(rippleRef, theme.colors.background.base.color, false, !button);

  const content = (
    <Fragment>
      {props.start && <div className={classes.start}>{props.start}</div>}
      <div className={classes.main}>
        <div className={classes.title}>{props.children}</div>
        {props.subtitle && (
          <div className={classes.subtitle}>{props.subtitle}</div>
        )}
      </div>
      {props.end && <div className={classes.end}>{props.end}</div>}
    </Fragment>
  );

  if (button) {
    return (
      <button className={`${classes.wrapper} ${className}`} ref={rippleRef}>
        {content}
      </button>
    );
  } else {
    return (
      <div className={`${classes.wrapper} ${className}`} ref={rippleRef}>
        {content}
      </div>
    );
  }
};

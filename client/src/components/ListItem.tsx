import React, { FC, Fragment, MouseEvent, ReactNode, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    ...theme.colors.background.base,
    ...theme.typography.body,
    fontSize: 18,
    lineHeight: "26px",
    outline: "none",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderLeft: "none",
    borderRight: "none",
    borderTop: `1px solid ${theme.colors.divider.base.color}`,
    borderBottom: `1px solid ${theme.colors.divider.base.color}`,
    position: "relative",
    width: "100%",
    marginTop: -1,
    borderRadius: 0,
    textAlign: "left",

    "&:last-child": {
      borderBottom: "none",
    },
  },
  padding: {
    padding: "16px 28px",
  },
  button: {
    ...theme.colors.background.base,
    textAlign: "left",
    border: "none",
    display: "flex",
    width: "100%",
    position: "relative",
    height: "100%",
    padding: "16px 28px",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",

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
    marginRight: 16,
    flex: "0 0 auto",
  },
  end: {
    marginLeft: 16,
    flex: "0 0 auto",
  },
  title: {},
  subtitle: {
    ...theme.typography.caption,
    fontSize: 14,
    lineHeight: "18px",
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
  const { className = "", button = false, onClick } = props;
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
      <li className={`${classes.wrapper} ${className}`}>
        <button className={classes.button} onClick={onClick} ref={rippleRef}>
          {content}
        </button>
      </li>
    );
  } else {
    return (
      <li
        className={`${classes.wrapper} ${className} ${classes.padding}`}
        ref={rippleRef}
      >
        {content}
      </li>
    );
  }
};

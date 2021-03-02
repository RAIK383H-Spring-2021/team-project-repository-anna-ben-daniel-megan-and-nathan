import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    ...theme.typography.preTitle,
  },
  select: {
    margin: "4px 0",
    padding: "12px 18px",
    ...theme.colors.background.light,
    ...theme.typography.body,
    border: `1px solid ${theme.colors.divider.base.color}`,
    borderRadius: 4,
    position: "relative",
    height: 44,
    appearance: "none",

    "&:hover": {
      border: `1px solid ${theme.colors.primary.light?.backgroundColor}`,
    },

    "&:focus": {
      border: `1px solid ${theme.colors.primary.base.backgroundColor}`,
      outline: "none",
    },

    "&::after": {
      fontFamily: "Material Icons",
      content: "'expand_more'",
      color: theme.colors.background.base.color,
      backgroundColor: "transparent",
      width: 18,
      height: 18,
      position: "absolute",
      zIndex: 99,
      left: 0,
      top: 0,
    },

    "&[disabled]": {
      background: theme.colors.divider.base.backgroundColor,
      cursor: "not-allowed",

      "&:hover": {
        border: `1px solid ${theme.colors.divider.base.color}`,
      },
    },
  },
  captionWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  caption: {
    ...theme.typography.caption,
  },
  wordLimit: {
    ...theme.typography.caption,
  },
}));

export interface SelectComponentProps {
  label: string;
  caption?: string;
}

export const Select: FC<SelectComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.wrapper}>
      {props.label && <label className={classes.label}>{props.label}</label>}
      <select className={classes.select}>{props.children}</select>
      <div className={classes.captionWrapper}>
        <span className={classes.caption}>{props.caption}</span>
      </div>
    </div>
  );
};

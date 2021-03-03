import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
  },
  type: {
    fontFamily: "Questrial",
    marginLeft: 12,
    userSelect: "none",
    fontSize: 32,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: theme.colors.background.base.color,
  },
}));

export interface LogoComponentProps {
  className?: string;
  type?: "icon" | "full";
}

export const Logo: FC<LogoComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={`${classes.wrapper} ${props.className ?? ""}`}>
      <img src="/icon.svg" alt="" role="presentation" />
      {props.type === "full" && <span className={classes.type}>Shindig</span>}
    </div>
  );
};

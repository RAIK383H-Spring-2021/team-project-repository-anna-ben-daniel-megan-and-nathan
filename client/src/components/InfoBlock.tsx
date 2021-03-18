import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";
import { Icon } from "./Icon";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "row",
  },
  icon: {
    fontSize: 14,
    color: theme.typography.caption.color,
    lineHeight: "20px",
    marginRight: 6,
  },
  label: {
    ...theme.typography.preTitle,
    margin: "6px 0",
  },
  body: {
    ...theme.typography.body,
    whiteSpace: "break-spaces",
    margin: 0,
    fontSize: 18,
    lineHeight: "24px",
  },
}));

export interface InfoBlockComponentProps {
  icon: string;
  label: string;
  body: string;
  bodyType?: "span" | "p";
}

export const InfoBlock: FC<InfoBlockComponentProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.wrapper}>
      <div>
        <Icon size="small" className={classes.icon} name={props.icon} />
      </div>
      <div>
        <div className={classes.label}>{props.label}</div>
        {props.bodyType === "p" ? (
          <p className={classes.body}>{props.body}</p>
        ) : (
          <span className={classes.body}>{props.body}</span>
        )}
      </div>
    </div>
  );
};

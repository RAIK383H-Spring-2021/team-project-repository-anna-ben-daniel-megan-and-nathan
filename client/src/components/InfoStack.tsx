import { createUseStyles } from "react-jss";
import { useTheme } from "theming";
import { AppTheme } from "../theme";
import { Icon } from "./Icon";

const useStyles = createUseStyles((theme: AppTheme) => ({
  stackWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    ...theme.typography.caption,
    fontSize: 12,
    marginRight: 6,
    lineHeight: "20px",
    textAlign: "right",
  },
  icon: {
    fontSize: 12,
    color: theme.typography.caption.color,
    lineHeight: "20px",
  },
}));

export interface InfoIconStackComponentProps {
  info: { text: string; icon: string }[];
}

export function InfoIconStack(props: InfoIconStackComponentProps) {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.stackWrapper}>
      {props.info.map((row, i) => (
        <div key={i} className={classes.row}>
          <span className={classes.text}>{row.text}</span>
          <Icon size="small" className={classes.icon} name={row.icon} />
        </div>
      ))}
    </div>
  );
}

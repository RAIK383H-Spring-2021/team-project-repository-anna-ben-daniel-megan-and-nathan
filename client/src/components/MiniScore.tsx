import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { getColor } from "../getColor";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  circle: {
    backgroundColor: ({ color }) => color.backgroundColor,
    padding: "9px 8px",
    borderRadius: 40,
    height: 32,
    width: 32,
    display: "flex",
  },
  value: {
    ...theme.typography.button,
    margin: "auto",
    color: ({ color }) => color.color,
  },
}));

export interface MiniScoreComponentProps {
  value: number;
}

export const MiniScore: FC<MiniScoreComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const color = getColor(props.value, theme);
  const classes = useStyles({ theme, color });

  return (
    <div className={classes.circle}>
      <span className={classes.value}>{props.value}</span>
    </div>
  );
};

import { type } from "node:os";
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
    transform: "translateY(-0.5px)",
  },
  response: {
    ...theme.typography.button,
    position: "absolute",
    width: "100%",
    height: "100%",
    color: theme.colors.background.base.color,
    display: "flex",

    "& span": {
      margin: "auto",
      transform: "translateY(-0.5px)",
    },
  },
}));

export interface MiniScoreComponentProps {
  value: number;
  type: "score" | "responses";
  max?: number;
}

const STROKE = 3;
const RADIUS = 16;
const NORM_RADIUS = RADIUS - STROKE;
const CIRCUMFERENCE = NORM_RADIUS * 2 * Math.PI;

export const MiniScore: FC<MiniScoreComponentProps> = (props) => {
  const { value, type, max = 100 } = props;
  const theme = useTheme<AppTheme>();
  const color = getColor(value, theme);
  const classes = useStyles({ theme, color });
  const offset = CIRCUMFERENCE - (value / max) * CIRCUMFERENCE;

  console.log();

  if (type === "score") {
    return (
      <div className={classes.circle}>
        <span className={classes.value}>{value}</span>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", position: "relative" }}>
        <svg height={RADIUS * 2} width={RADIUS * 2}>
          <circle
            stroke="rgba(31, 87, 196, 0.25)"
            strokeWidth={STROKE}
            fill="transparent"
            r={NORM_RADIUS}
            cx={RADIUS}
            cy={RADIUS}
          />
          <circle
            stroke={theme.colors.primary.base.backgroundColor}
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            style={{
              strokeDashoffset: offset + "px",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
            strokeWidth={STROKE}
            fill="transparent"
            r={NORM_RADIUS}
            cx={RADIUS}
            cy={RADIUS}
          />
        </svg>
        <div className={classes.response}>
          <span>{value}</span>
        </div>
      </div>
    );
  }
};

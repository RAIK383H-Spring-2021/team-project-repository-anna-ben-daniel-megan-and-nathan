import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { getColor } from "../getColor";
import { AppTheme } from "../theme";
import { Icon } from "./Icon";
import { round } from "./Score";

const useStyles = createUseStyles((theme: AppTheme) => ({
  circle: {
    backgroundColor: ({ color }) => color.backgroundColor,
    borderRadius: 100,
    height: ({ icon }) => (icon ? 60 : 36),
    width: ({ icon }) => (icon ? 60 : 36),
    display: "flex",
    userSelect: "none",
  },
  value: {
    ...theme.typography.button,
    margin: "auto",
    color: ({ color }) => color.color,
    transform: "translateY(-0.5px)",
    fontSize: 14,
  },
  response: {
    ...theme.typography.button,
    fontSize: 14,
    position: "absolute",
    width: "100%",
    height: "100%",
    color: theme.colors.background.base.color,
    display: "flex",

    "& span": {
      margin: "auto",
    },
  },
}));

export interface MiniScoreComponentProps {
  value: number;
  type: "score" | "responses";
  max?: number;
  icon?: string;
}

const STROKE = 3;
const RADIUS = 18;
const NORM_RADIUS = RADIUS - STROKE;
const CIRCUMFERENCE = NORM_RADIUS * 2 * Math.PI;

export const MiniScore: FC<MiniScoreComponentProps> = (props) => {
  const { value, type, max = 100, icon } = props;

  const clampedValue = value > max ? max : value < 0 ? 0 : value;

  const theme = useTheme<AppTheme>();
  const color = getColor(value, theme);
  const classes = useStyles({ theme, color, icon: !!icon });
  const offset = CIRCUMFERENCE - (clampedValue / max) * CIRCUMFERENCE;

  if (type === "score") {
    return (
      <div className={classes.circle}>
        <span className={classes.value}>
          {icon ? <Icon name={icon} /> : value < 0 ? "?" : round(value)}
        </span>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", position: "relative" }}>
        <svg height={RADIUS * 2} width={RADIUS * 2}>
          <circle
            stroke="rgba(31, 87, 196, 0.25)"
            strokeWidth={STROKE}
            fill={value < 0 ? "rgba(31, 87, 196, 0.25)" : "transparent"}
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
          <span>
            {icon ? <Icon name={icon} /> : value < 0 ? "?" : round(value)}
          </span>
        </div>
      </div>
    );
  }
};
